import type { Request, Response } from "express";
import { pool } from "../db/pool.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signAccessToken } from "../utils/jwt.js";

// --- shared validation helpers ---------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LEN = 8;

interface SignupBody {
  full_name?: unknown;
  email?: unknown;
  password?: unknown;
}
interface LoginBody {
  email?: unknown;
  password?: unknown;
}

function badRequest(res: Response, message: string): void {
  res.status(400).json({ error: message });
}

// Strip columns we never want to leak. Whitelist > blacklist.
function publicUser(row: {
  user_id: number;
  email: string;
  full_name: string | null;
  profile_image_url: string | null;
  public_slug: string | null;
  is_active: boolean;
  created_at: Date;
}) {
  return {
    user_id: row.user_id,
    email: row.email,
    full_name: row.full_name,
    profile_image_url: row.profile_image_url,
    public_slug: row.public_slug,
    is_active: row.is_active,
    created_at: row.created_at,
  };
}

// --- signup -----------------------------------------------------------------

export async function signup(req: Request, res: Response): Promise<void> {
  const body = req.body as SignupBody;
  const full_name = typeof body.full_name === "string" ? body.full_name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !EMAIL_RE.test(email)) return badRequest(res, "invalid email");
  if (password.length < MIN_PASSWORD_LEN) {
    return badRequest(res, `password must be at least ${MIN_PASSWORD_LEN} chars`);
  }

  const password_hash = await hashPassword(password);

  try {
    const result = await pool.query<{
      user_id: number;
      email: string;
      full_name: string | null;
      profile_image_url: string | null;
      public_slug: string | null;
      is_active: boolean;
      created_at: Date;
    }>(
      `INSERT INTO users (email, full_name, password_hash)
       VALUES ($1, NULLIF($2, ''), $3)
       RETURNING user_id, email, full_name, profile_image_url,
                 public_slug, is_active, created_at`,
      [email, full_name, password_hash],
    );

    const user = result.rows[0];
    if (!user) return badRequest(res, "could not create user");
    const token = signAccessToken({ user_id: user.user_id });
    res.status(201).json({ user: publicUser(user), token });
  } catch (err: unknown) {
    // 23505 = unique_violation on email
    if (
      typeof err === "object" && err !== null && "code" in err &&
      (err as { code: unknown }).code === "23505"
    ) {
      res.status(409).json({ error: "email already registered" });
      return;
    }
    console.error("[signup] db error:", err);
    res.status(500).json({ error: "internal error" });
  }
}

// --- login ------------------------------------------------------------------

export async function login(req: Request, res: Response): Promise<void> {
  const body = req.body as LoginBody;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) return badRequest(res, "email and password required");

  const result = await pool.query<{
    user_id: number;
    email: string;
    full_name: string | null;
    profile_image_url: string | null;
    public_slug: string | null;
    is_active: boolean;
    created_at: Date;
    password_hash: string;
  }>(
    `SELECT user_id, email, full_name, profile_image_url, public_slug,
            is_active, created_at, password_hash
       FROM users
      WHERE email = $1
      LIMIT 1`,
    [email],
  );

  const row = result.rows[0];

  // Generic error for "no such user" OR "wrong password" — same message, same
  // status. Run a dummy bcrypt compare in the no-user case so timing matches.
  if (!row) {
    await verifyPassword(password, "$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid");
    res.status(401).json({ error: "invalid credentials" });
    return;
  }

  if (!row.is_active) {
    res.status(403).json({ error: "account disabled" });
    return;
  }

  const ok = await verifyPassword(password, row.password_hash);
  if (!ok) {
    res.status(401).json({ error: "invalid credentials" });
    return;
  }

  const token = signAccessToken({ user_id: row.user_id });
  res.status(200).json({ user: publicUser(row), token });
}
