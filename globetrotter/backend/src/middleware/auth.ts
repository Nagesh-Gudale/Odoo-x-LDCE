import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, type JwtPayload } from "../utils/jwt.js";

// Augment Express's Request so handlers downstream can read req.user_id
// without casting. No-op for unauthenticated routes.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user_id?: number;
      user_role?: "user" | "admin";
    }
  }
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.header("authorization") ?? req.header("Authorization");
  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    res.status(401).json({ error: "missing bearer token" });
    return;
  }
  const token = header.slice("bearer ".length).trim();
  if (token.length === 0) {
    res.status(401).json({ error: "missing bearer token" });
    return;
  }

  try {
    const payload: JwtPayload = verifyAccessToken(token);
    req.user_id = payload.user_id;
    req.user_role = payload.role;
    next();
  } catch {
    res.status(401).json({ error: "invalid or expired token" });
  }
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.user_role !== "admin") {
    res.status(403).json({ error: "admin access required" });
    return;
  }

  next();
}
