import "dotenv/config";

function optional(key: string, fallback: string): string {
  const v = process.env[key];
  if (!v || v.length === 0) {
    return fallback;
  }
  return v;
}

function required(key: string): string {
  const v = process.env[key];
  if (!v || v.length === 0) {
    throw new Error(
      `[env] ${key} is required but is not set. ` +
        `Add it to backend/.env (see .env.example for the full list).`,
    );
  }
  return v;
}

function intEnv(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw.length === 0) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

// Resolve required vars at module load so a misconfigured deploy fails fast
// (clear stack trace) rather than producing a confusing error the first time a
// route touches env.JWT_SECRET or env.GMAIL_APP_PASSWORD.
const JWT_SECRET = required("JWT_SECRET");
const GMAIL_APP_PASSWORD = required("GMAIL_APP_PASSWORD");

export const env = {
  DATABASE_URL: optional(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/globetrotter",
  ),
  JWT_SECRET,
  JWT_EXPIRES_IN: intEnv("JWT_EXPIRES_IN", 86400),
  BCRYPT_ROUNDS: intEnv("BCRYPT_ROUNDS", 10),
  FRONTEND_ORIGIN: process.env["FRONTEND_ORIGIN"] ?? "http://localhost:5173",
  PORT: intEnv("PORT", 3000),

  // OTP / Gmail SMTP
  GMAIL_USER: optional("GMAIL_USER", "admin@globetrotter.com"),
  GMAIL_APP_PASSWORD,
  OTP_TTL_MINUTES: intEnv("OTP_TTL_MINUTES", 10),
  OTP_PENDING_TTL_SECONDS: intEnv("OTP_PENDING_TTL_SECONDS", 900),
  OTP_MAX_ATTEMPTS: intEnv("OTP_MAX_ATTEMPTS", 5),
  OTP_RESEND_COOLDOWN_SECONDS: intEnv("OTP_RESEND_COOLDOWN_SECONDS", 60),
} as const;
