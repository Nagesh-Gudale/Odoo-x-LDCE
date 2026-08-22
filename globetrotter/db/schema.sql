-- =============================================================================
-- GlobeTrotter — full canonical schema (single bootstrap file)
-- =============================================================================
-- This file is the single source of truth for the schema. It replaces the prior
-- split between db/schema.sql (v1) and db/migrations/0002_*.sql / 0003_*.sql.
--
-- The file is idempotent: every CREATE / ALTER uses IF NOT EXISTS / DO blocks so
-- it is safe to re-run against an already-bootstrapped database. The original
-- migrations directory has been removed; any future change should be appended
-- here (and documented in the file header) rather than added as a numbered file.
--
-- The live database will be brought in sync with this file by running it manually
-- against the running container (see commands at end of diagnostic report).
--
-- Apply order: countries → users (+ email_verified) → user_preferences →
-- password_reset → categories → cities → saved_cities → activities → trips →
-- trip_shares → trip_stops → trip_days → itinerary_items → expenses → otp_codes.
-- =============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----- countries (referenced by cities) --------------------------------------
CREATE TABLE IF NOT EXISTS countries (
    country_id  serial PRIMARY KEY,
    name        text NOT NULL UNIQUE,
    iso_code    char(2) UNIQUE,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- ----- users ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id           serial PRIMARY KEY,
    email             text NOT NULL UNIQUE,
    full_name         varchar(100),
    password_hash     varchar(255) NOT NULL,
    profile_image_url text,
    public_slug       text UNIQUE,
    is_active         boolean NOT NULL DEFAULT true,
    email_verified    boolean NOT NULL DEFAULT false,
    role              varchar(20) NOT NULL DEFAULT 'user',
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'))
);

-- Add role column on already-bootstrapped databases (idempotent).
ALTER TABLE users ADD COLUMN IF NOT EXISTS role varchar(20) NOT NULL DEFAULT 'user';
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'users_role_check'
    ) THEN
        ALTER TABLE users
            ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));
    END IF;
END
$$;

-- updated_at auto-bump trigger
CREATE OR REPLACE FUNCTION users_touch_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_touch_updated_at ON users;
CREATE TRIGGER users_touch_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION users_touch_updated_at();

-- ----- user_preferences ------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_preferences (
    preference_id           serial PRIMARY KEY,
    user_id                 integer NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    theme                   text NOT NULL DEFAULT 'system',
    default_currency        char(3) NOT NULL DEFAULT 'USD',
    default_trip_visibility text NOT NULL DEFAULT 'private'
                             CHECK (default_trip_visibility IN ('private','shared','public')),
    notification_opt_in     boolean NOT NULL DEFAULT true,
    created_at              timestamptz NOT NULL DEFAULT now(),
    updated_at              timestamptz NOT NULL DEFAULT now()
);

-- ----- password_reset -------------------------------------------------------
CREATE TABLE IF NOT EXISTS password_reset (
    password_reset_id   serial PRIMARY KEY,
    user_id             integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash          text NOT NULL,
    expires_at          timestamptz NOT NULL,
    used_at             timestamptz,
    created_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS password_reset_by_user ON password_reset (user_id);

-- ----- categories (merged; replaces activity_categories + expense_categories) -
CREATE TABLE IF NOT EXISTS categories (
    category_id serial PRIMARY KEY,
    name        text NOT NULL,
    type        text NOT NULL CHECK (type IN ('expense','activity')),
    created_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (name, type)
);

-- ----- cities ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cities (
    city_id     serial PRIMARY KEY,
    country_id  integer NOT NULL REFERENCES countries(country_id) ON DELETE RESTRICT,
    name        text NOT NULL,
    cost_index  numeric(6,2) NOT NULL DEFAULT 1.00,
    popularity  integer NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (country_id, name)
);
CREATE INDEX IF NOT EXISTS cities_by_country ON cities (country_id);

-- ----- saved_cities ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_cities (
    saved_city_id   serial PRIMARY KEY,
    user_id         integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    city_id         integer NOT NULL REFERENCES cities(city_id) ON DELETE CASCADE,
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, city_id)
);
CREATE INDEX IF NOT EXISTS saved_cities_by_user ON saved_cities (user_id);

-- ----- activities -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS activities (
    activity_id    serial PRIMARY KEY,
    city_id        integer NOT NULL REFERENCES cities(city_id)        ON DELETE CASCADE,
    category_id    integer          REFERENCES categories(category_id) ON DELETE SET NULL,
    name           text NOT NULL,
    cost           numeric(10,2) NOT NULL DEFAULT 0,
    duration_mins  integer NOT NULL DEFAULT 60 CHECK (duration_mins >= 0),
    created_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE (city_id, name)
);
CREATE INDEX IF NOT EXISTS activities_by_city ON activities (city_id);

-- ----- trips ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trips (
    trip_id      serial PRIMARY KEY,
    owner_id     integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name         text NOT NULL,
    description  text,
    start_date   date NOT NULL,
    end_date     date NOT NULL,
    is_public    boolean NOT NULL DEFAULT false,
    public_slug  text UNIQUE,                          -- unguessable share URL
    created_at   timestamptz NOT NULL DEFAULT now(),
    CHECK (end_date >= start_date)
);
CREATE INDEX IF NOT EXISTS trips_by_owner ON trips (owner_id);

-- ----- trip_shares ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS trip_shares (
    trip_share_id  serial PRIMARY KEY,
    trip_id        integer NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    user_id        integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role           text NOT NULL DEFAULT 'editor'
                    CHECK (role IN ('viewer','editor')),
    created_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE (trip_id, user_id)
);
CREATE INDEX IF NOT EXISTS trip_shares_by_user ON trip_shares (user_id);

-- ----- trip_stops -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS trip_stops (
    trip_stop_id  serial PRIMARY KEY,
    trip_id       integer NOT NULL REFERENCES trips(trip_id)   ON DELETE CASCADE,
    city_id       integer NOT NULL REFERENCES cities(city_id)   ON DELETE RESTRICT,
    start_date    date NOT NULL,
    end_date      date NOT NULL,
    seq           integer NOT NULL,
    created_at    timestamptz NOT NULL DEFAULT now(),
    CHECK (end_date >= start_date),
    CHECK (seq >= 0),
    UNIQUE (trip_id, seq),
    UNIQUE (trip_id, city_id)
);
CREATE INDEX IF NOT EXISTS trip_stops_by_trip ON trip_stops (trip_id);
CREATE INDEX IF NOT EXISTS trip_stops_by_city ON trip_stops (city_id);

-- ----- trip_days ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trip_days (
    trip_day_id    serial PRIMARY KEY,
    trip_stop_id   integer NOT NULL REFERENCES trip_stops(trip_stop_id) ON DELETE CASCADE,
    trip_id        integer NOT NULL REFERENCES trips(trip_id)           ON DELETE CASCADE,
    date           date   NOT NULL,
    day_index      integer NOT NULL,
    created_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE (trip_stop_id, day_index)
);
CREATE INDEX IF NOT EXISTS trip_days_by_trip ON trip_days (trip_id);

-- ----- itinerary_items ------------------------------------------------------
CREATE TABLE IF NOT EXISTS itinerary_items (
    itinerary_item_id  serial PRIMARY KEY,
    trip_day_id        integer NOT NULL REFERENCES trip_days(trip_day_id)   ON DELETE CASCADE,
    activity_id        integer NOT NULL REFERENCES activities(activity_id)   ON DELETE RESTRICT,
    scheduled_time     time,
    quantity           integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
    override_cost      numeric(10,2),
    note               text,
    created_at         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS itinerary_items_by_day      ON itinerary_items (trip_day_id);
CREATE INDEX IF NOT EXISTS itinerary_items_by_activity ON itinerary_items (activity_id);

-- ----- expenses -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS expenses (
    expense_id      serial PRIMARY KEY,
    trip_id         integer NOT NULL REFERENCES trips(trip_id)         ON DELETE CASCADE,
    paid_by         integer NOT NULL REFERENCES users(user_id)         ON DELETE RESTRICT,
    category_id     integer          REFERENCES categories(category_id) ON DELETE SET NULL,
    description     text,
    amount          numeric(12,2) NOT NULL,
    currency        char(3) NOT NULL DEFAULT 'USD',
    expense_date    date NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS expenses_by_trip    ON expenses (trip_id);
CREATE INDEX IF NOT EXISTS expenses_by_paid_by ON expenses (paid_by);

-- ----- otp_codes (email OTP for signup verification + login MFA) -----------
-- otp_hash holds a SHA-256 hex digest of the 6-digit code (not bcrypt — codes
-- are short and low-entropy, bcrypt would still be fine, but sha256 is cheaper
-- and verifiable in-constant-time just as easily).
-- A single row per active attempt; old unused rows are left in place (auditable)
-- and superseded by inserting a new row + marking the old one used_at on verify.
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
