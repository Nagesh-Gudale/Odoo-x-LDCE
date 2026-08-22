import "dotenv/config";
function optional(key, fallback) {
    const v = process.env[key];
    if (!v || v.length === 0) {
        return fallback;
    }
    return v;
}
function intEnv(key, fallback) {
    const raw = process.env[key];
    if (raw === undefined || raw.length === 0)
        return fallback;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? n : fallback;
}
export const env = {
    DATABASE_URL: optional("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/globetrotter"),
    JWT_SECRET: optional("JWT_SECRET", "globetrotter_jwt_secret_key_2026"),
    JWT_EXPIRES_IN: intEnv("JWT_EXPIRES_IN", 86400),
    BCRYPT_ROUNDS: intEnv("BCRYPT_ROUNDS", 10),
    FRONTEND_ORIGIN: process.env["FRONTEND_ORIGIN"] ?? "http://localhost:5173",
    // OTP / Gmail SMTP
    GMAIL_USER: optional("GMAIL_USER", "admin@globetrotter.com"),
    GMAIL_APP_PASSWORD: optional("GMAIL_APP_PASSWORD", "mock_app_password"),
    OTP_TTL_MINUTES: intEnv("OTP_TTL_MINUTES", 10),
    OTP_PENDING_TTL_SECONDS: intEnv("OTP_PENDING_TTL_SECONDS", 900),
    OTP_MAX_ATTEMPTS: intEnv("OTP_MAX_ATTEMPTS", 5),
    OTP_RESEND_COOLDOWN_SECONDS: intEnv("OTP_RESEND_COOLDOWN_SECONDS", 60),
};
//# sourceMappingURL=env.js.map