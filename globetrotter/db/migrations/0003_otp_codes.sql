-- =============================================================================
-- Migration 0003 — email OTP for signup verification + login MFA
-- Applies on top of 0002 (which already reshaped the users table).
--
-- Run manually:
--   docker exec -i globetrotter-db psql -U yasha -d globetrotter \
--     < db/migrations/0003_otp_codes.sql
--
-- Notes:
--   * Timestamps are timestamptz to stay consistent with the rest of the schema.
--   * otp_hash holds a SHA-256 hex digest of the 6-digit code (not bcrypt — codes
--     are short and low-entropy, bcrypt would still be fine, but sha256 is cheaper
--     and verifiable in-constant-time just as easily).
--   * A single row per active attempt; old unused rows are left in place (auditable)
--     and superseded by inserting a new row + marking the old one used_at on verify.
-- =============================================================================

BEGIN;

-- 1. users.email_verified ---------------------------------------------------
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT false;

-- 2. otp_codes --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS otp_codes (
    otp_id          serial PRIMARY KEY,
    user_id         integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    otp_hash        varchar(255) NOT NULL,
    purpose         varchar(20)  NOT NULL
                    CHECK (purpose IN ('signup_verify', 'login_mfa')),
    expires_at      timestamptz  NOT NULL,
    used_at         timestamptz,
    attempt_count   integer      NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
    created_at      timestamptz  NOT NULL DEFAULT now()
);

-- Resend-OTP rate-limit + verify lookup both go via (user_id, purpose).
-- Partial index keeps "active codes" queries small by ignoring consumed rows.
CREATE INDEX IF NOT EXISTS otp_codes_user_purpose_active_idx
    ON otp_codes (user_id, purpose, created_at DESC)
    WHERE used_at IS NULL;

-- Sweeping expired codes (cron / maintenance) — separate, less critical index.
CREATE INDEX IF NOT EXISTS otp_codes_expires_at_idx
    ON otp_codes (expires_at);

COMMIT;
