import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";
import { env } from "../config/env.js";
import { signAccessToken } from "../utils/jwt.js";
import { sendOtpEmail } from "../utils/mailer.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
// --- shared validation helpers ---------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LEN = 8;
function badRequest(res, message) {
    res.status(400).json({ error: message });
}
function publicUser(row) {
    return {
        user_id: row.user_id,
        email: row.email,
        full_name: row.full_name,
        profile_image_url: row.profile_image_url,
        public_slug: row.public_slug,
        is_active: row.is_active,
        role: row.role,
        created_at: row.created_at,
    };
}
function generateNumericOtp() {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");
}
function hashOtpCode(otp) {
    return crypto.createHash("sha256").update(otp).digest("hex");
}
function genericOtpError(res) {
    res.status(400).json({ error: "invalid or expired otp" });
}
async function invalidateUnusedOtps(userId, purpose) {
    await pool.query(`UPDATE otp_codes
        SET used_at = NOW()
      WHERE user_id = $1
        AND purpose = $2
        AND used_at IS NULL`, [userId, purpose]);
}
async function issueOtpForUser(userId, email, purpose) {
    const otp = generateNumericOtp();
    const otpHash = hashOtpCode(otp);
    const expiresAt = new Date(Date.now() + env.OTP_TTL_MINUTES * 60_000);
    await pool.query(`INSERT INTO otp_codes (user_id, otp_hash, purpose, expires_at, used_at, attempt_count, created_at)
     VALUES ($1, $2, $3, $4, NULL, 0, NOW())`, [userId, otpHash, purpose, expiresAt]);
    await sendOtpEmail({
        to: email,
        otp,
        purpose,
        ttlMinutes: env.OTP_TTL_MINUTES,
    });
}
async function validateOtpForUser(userId, purpose, enteredOtp) {
    const result = await pool.query(`SELECT otp_id, otp_hash, expires_at, used_at, attempt_count
       FROM otp_codes
      WHERE user_id = $1
        AND purpose = $2
        AND used_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1`, [userId, purpose]);
    const row = result.rows[0];
    if (!row)
        return false;
    const now = new Date();
    const nextAttemptCount = Number(row.attempt_count) + 1;
    const isExpired = row.expires_at <= now;
    if (!isExpired) {
        const expectedHash = Buffer.from(row.otp_hash, "hex");
        const actualHash = Buffer.from(hashOtpCode(enteredOtp), "hex");
        if (expectedHash.length === actualHash.length && crypto.timingSafeEqual(expectedHash, actualHash)) {
            // Correct code: burn the row regardless of attempt count, mark consumed.
            await pool.query(`UPDATE otp_codes
            SET used_at = NOW(),
                attempt_count = $1
          WHERE otp_id = $2`, [nextAttemptCount, row.otp_id]);
            return true;
        }
    }
    // Either the code was wrong, or the row was already expired. Either way:
    //   * bump attempt_count,
    //   * burn the row ONLY when the post-bump count strictly exceeds the cap
    //     (i.e. the failing attempt was the one that put it over the edge).
    //     Burning on equality would lock the user out one attempt earlier than
    //     the documented cap.
    await pool.query(`UPDATE otp_codes
        SET attempt_count = $1,
            used_at = CASE
                WHEN $1 > $2 THEN NOW()
                WHEN $3 THEN NOW()
                ELSE used_at
            END
      WHERE otp_id = $4`, [nextAttemptCount, env.OTP_MAX_ATTEMPTS, isExpired, row.otp_id]);
    return false;
}
// --- signup -----------------------------------------------------------------
export async function signup(req, res) {
    const body = req.body;
    const full_name = typeof body.full_name === "string" ? body.full_name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !EMAIL_RE.test(email))
        return badRequest(res, "invalid email");
    if (password.length < MIN_PASSWORD_LEN) {
        return badRequest(res, `password must be at least ${MIN_PASSWORD_LEN} chars`);
    }
    const password_hash = await hashPassword(password);
    try {
        const result = await pool.query(`INSERT INTO users (email, full_name, password_hash, email_verified)
       VALUES ($1, NULLIF($2, ''), $3, false)
       RETURNING user_id, email, full_name, profile_image_url,
                 public_slug, is_active, role, created_at`, [email, full_name, password_hash]);
        const user = result.rows[0];
        if (!user)
            return badRequest(res, "could not create user");
        await invalidateUnusedOtps(user.user_id, "signup_verify");
        await issueOtpForUser(user.user_id, email, "signup_verify");
        res.status(201).json({
            user: publicUser(user),
            message: "account created. please verify your email.",
        });
    }
    catch (err) {
        if (typeof err === "object" && err !== null && "code" in err &&
            err.code === "23505") {
            res.status(409).json({ error: "email already registered" });
            return;
        }
        console.error("[signup] db error:", err);
        res.status(500).json({ error: "internal error" });
    }
}
export async function verifySignup(req, res) {
    const body = req.body;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const otp = typeof body.otp === "string" ? body.otp.trim() : "";
    if (!email || !otp) {
        genericOtpError(res);
        return;
    }
    const userResult = await pool.query(`SELECT user_id, email, email_verified
       FROM users
      WHERE email = $1
      LIMIT 1`, [email]);
    const user = userResult.rows[0];
    if (!user) {
        genericOtpError(res);
        return;
    }
    if (user.email_verified) {
        // Don't leak "wrong code" — the real story is "nothing to verify".
        res.status(409).json({ error: "email already verified" });
        return;
    }
    const ok = await validateOtpForUser(user.user_id, "signup_verify", otp);
    if (!ok) {
        genericOtpError(res);
        return;
    }
    await pool.query(`UPDATE users
        SET email_verified = true
      WHERE user_id = $1`, [user.user_id]);
    res.status(200).json({ message: "email verified successfully" });
}
// --- login ------------------------------------------------------------------
export async function login(req, res) {
    const body = req.body;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password)
        return badRequest(res, "email and password required");
    const result = await pool.query(`SELECT user_id, email, full_name, profile_image_url, public_slug,
            is_active, email_verified, role, created_at, password_hash
       FROM users
      WHERE email = $1
      LIMIT 1`, [email]);
    const row = result.rows[0];
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
    if (!row.email_verified) {
        res.status(403).json({ error: "please verify your email first" });
        return;
    }
    await invalidateUnusedOtps(row.user_id, "login_mfa");
    await issueOtpForUser(row.user_id, row.email, "login_mfa");
    const pendingToken = jwt.sign({ user_id: row.user_id, purpose: "login_mfa" }, env.JWT_SECRET, { expiresIn: env.OTP_PENDING_TTL_SECONDS });
    res.status(200).json({
        message: "verification code sent",
        pending_token: pendingToken,
    });
}
export async function verifyLoginOtp(req, res) {
    const body = req.body;
    const pendingToken = typeof body.pending_token === "string" ? body.pending_token.trim() : "";
    const otp = typeof body.otp === "string" ? body.otp.trim() : "";
    if (!pendingToken || !otp) {
        genericOtpError(res);
        return;
    }
    let payload;
    try {
        payload = jwt.verify(pendingToken, env.JWT_SECRET);
    }
    catch {
        genericOtpError(res);
        return;
    }
    if (payload.purpose !== "login_mfa" || typeof payload.user_id !== "number") {
        genericOtpError(res);
        return;
    }
    const userResult = await pool.query(`SELECT user_id, email, full_name, profile_image_url, public_slug,
            is_active, role, created_at
       FROM users
      WHERE user_id = $1
      LIMIT 1`, [payload.user_id]);
    const user = userResult.rows[0];
    if (!user) {
        genericOtpError(res);
        return;
    }
    const ok = await validateOtpForUser(user.user_id, "login_mfa", otp);
    if (!ok) {
        genericOtpError(res);
        return;
    }
    const token = signAccessToken({ user_id: user.user_id, role: user.role });
    res.status(200).json({ user: publicUser(user), token });
}
export async function resendOtp(req, res) {
    const body = req.body;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const purpose = typeof body.purpose === "string" ? body.purpose : "";
    if (!email || !EMAIL_RE.test(email)) {
        return badRequest(res, "invalid email");
    }
    if (purpose !== "signup_verify" && purpose !== "login_mfa") {
        return badRequest(res, "invalid otp purpose");
    }
    const userResult = await pool.query(`SELECT user_id, email, email_verified
       FROM users
      WHERE email = $1
      LIMIT 1`, [email]);
    const user = userResult.rows[0];
    if (!user) {
        return badRequest(res, "invalid email");
    }
    if (purpose === "signup_verify" && user.email_verified) {
        res.status(400).json({ error: "invalid or expired otp" });
        return;
    }
    // A login MFA code is only useful after the user has verified their email.
    // Without this gate, an attacker who knows a target's password can keep
    // spamming login_mfa OTPs to noise up their inbox.
    if (purpose === "login_mfa" && !user.email_verified) {
        res.status(403).json({ error: "please verify your email first" });
        return;
    }
    // Invalidate any un-consumed prior OTP for this (user, purpose) BEFORE the
    // cooldown check so a phished prior code can never be reused while the user
    // waits for the cooldown window to elapse.
    await invalidateUnusedOtps(user.user_id, purpose);
    const recentResult = await pool.query(`SELECT created_at
       FROM otp_codes
      WHERE user_id = $1
        AND purpose = $2
        AND used_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1`, [user.user_id, purpose]);
    const recent = recentResult.rows[0];
    if (recent) {
        const elapsedMs = Date.now() - new Date(recent.created_at).getTime();
        if (elapsedMs < env.OTP_RESEND_COOLDOWN_SECONDS * 1000) {
            res.status(429).json({ error: "please wait before requesting another code" });
            return;
        }
    }
    await issueOtpForUser(user.user_id, user.email, purpose);
    res.status(200).json({ message: "verification code sent" });
}
//# sourceMappingURL=auth.controller.js.map