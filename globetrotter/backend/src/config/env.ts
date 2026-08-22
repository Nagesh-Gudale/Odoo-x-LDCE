import "dotenv/config";

// Single source of truth for env. Throws on missing required keys at import
// time so the server fails fast instead of crashing mid-request.
function required(key: string): string {
  const v = process.env[key];
  if (!v || v.length === 0) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return v;
}

function intEnv(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw.length === 0) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

export const env = {
  DATABASE_URL: required("DATABASE_URL"),
  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: intEnv("JWT_EXPIRES_IN", 900),
  BCRYPT_ROUNDS: intEnv("BCRYPT_ROUNDS", 10),

  // OTP / Gmail SMTP
  GMAIL_USER: required("GMAIL_USER"),
  GMAIL_APP_PASSWORD: required("GMAIL_APP_PASSWORD"),
  OTP_TTL_MINUTES: intEnv("OTP_TTL_MINUTES", 10),
  OTP_PENDING_TTL_SECONDS: intEnv("OTP_PENDING_TTL_SECONDS", 900),
  OTP_MAX_ATTEMPTS: intEnv("OTP_MAX_ATTEMPTS", 5),
  OTP_RESEND_COOLDOWN_SECONDS: intEnv("OTP_RESEND_COOLDOWN_SECONDS", 60),
} as const;
