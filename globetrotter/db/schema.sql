-- =============================================================================
-- GlobeTrotter — foundational Postgres schema (hackathon MVP, current)
-- Single-file DDL. Applied by docker-compose entrypoint on first DB boot.
-- Apply order: countries → users → user_preferences → password_reset →
-- categories → cities → saved_cities → activities → trips → trip_shares →
-- trip_stops → trip_days → itinerary_items → expenses.
-- =============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----- countries (referenced by cities) --------------------------------------
CREATE TABLE countries (
    country_id  serial PRIMARY KEY,
    name        text NOT NULL UNIQUE,
    iso_code    char(2) UNIQUE,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- ----- users ----------------------------------------------------------------
CREATE TABLE users (
    user_id        serial PRIMARY KEY,
    email          text NOT NULL UNIQUE,
    display_name   text NOT NULL,
    password_hash  text NOT NULL,                          -- backend fills; schema is auth-agnostic
    public_slug    text UNIQUE,                            -- unguessable share URL for profile
    created_at     timestamptz NOT NULL DEFAULT now()
);

-- ----- user_preferences ------------------------------------------------------
CREATE TABLE user_preferences (
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
CREATE TABLE password_reset (
    password_reset_id   serial PRIMARY KEY,
    user_id             integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash          text NOT NULL,
    expires_at          timestamptz NOT NULL,
    used_at             timestamptz,
    created_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX password_reset_by_user ON password_reset (user_id);

-- ----- categories (merged; replaces activity_categories + expense_categories) -
CREATE TABLE categories (
    category_id serial PRIMARY KEY,
    name        text NOT NULL,
    type        text NOT NULL CHECK (type IN ('expense','activity')),
    created_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (name, type)
);

-- ----- cities ---------------------------------------------------------------
CREATE TABLE cities (
    city_id     serial PRIMARY KEY,
    country_id  integer NOT NULL REFERENCES countries(country_id) ON DELETE RESTRICT,
    name        text NOT NULL,
    cost_index  numeric(6,2) NOT NULL DEFAULT 1.00,
    popularity  integer NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (country_id, name)
);
CREATE INDEX cities_by_country ON cities (country_id);

-- ----- saved_cities ---------------------------------------------------------
CREATE TABLE saved_cities (
    saved_city_id   serial PRIMARY KEY,
    user_id         integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    city_id         integer NOT NULL REFERENCES cities(city_id) ON DELETE CASCADE,
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, city_id)
);
CREATE INDEX saved_cities_by_user ON saved_cities (user_id);

-- ----- activities -----------------------------------------------------------
CREATE TABLE activities (
    activity_id    serial PRIMARY KEY,
    city_id        integer NOT NULL REFERENCES cities(city_id)        ON DELETE CASCADE,
    category_id    integer          REFERENCES categories(category_id) ON DELETE SET NULL,
    name           text NOT NULL,
    cost           numeric(10,2) NOT NULL DEFAULT 0,
    duration_mins  integer NOT NULL DEFAULT 60 CHECK (duration_mins >= 0),
    created_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE (city_id, name)
);
CREATE INDEX activities_by_city ON activities (city_id);

-- ----- trips ----------------------------------------------------------------
CREATE TABLE trips (
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
CREATE INDEX trips_by_owner ON trips (owner_id);

-- ----- trip_shares ----------------------------------------------------------
CREATE TABLE trip_shares (
    trip_share_id  serial PRIMARY KEY,
    trip_id        integer NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    user_id        integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role           text NOT NULL DEFAULT 'editor'
                    CHECK (role IN ('viewer','editor')),
    created_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE (trip_id, user_id)
);
CREATE INDEX trip_shares_by_user ON trip_shares (user_id);

-- ----- trip_stops -----------------------------------------------------------
CREATE TABLE trip_stops (
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
CREATE INDEX trip_stops_by_trip ON trip_stops (trip_id);
CREATE INDEX trip_stops_by_city ON trip_stops (city_id);

-- ----- trip_days ------------------------------------------------------------
CREATE TABLE trip_days (
    trip_day_id    serial PRIMARY KEY,
    trip_stop_id   integer NOT NULL REFERENCES trip_stops(trip_stop_id) ON DELETE CASCADE,
    trip_id        integer NOT NULL REFERENCES trips(trip_id)           ON DELETE CASCADE,
    date           date   NOT NULL,
    day_index      integer NOT NULL,
    created_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE (trip_stop_id, day_index)
);
CREATE INDEX trip_days_by_trip ON trip_days (trip_id);

-- ----- itinerary_items ------------------------------------------------------
CREATE TABLE itinerary_items (
    itinerary_item_id  serial PRIMARY KEY,
    trip_day_id        integer NOT NULL REFERENCES trip_days(trip_day_id)   ON DELETE CASCADE,
    activity_id        integer NOT NULL REFERENCES activities(activity_id)   ON DELETE RESTRICT,
    scheduled_time     time,
    quantity           integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
    override_cost      numeric(10,2),
    note               text,
    created_at         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX itinerary_items_by_day      ON itinerary_items (trip_day_id);
CREATE INDEX itinerary_items_by_activity ON itinerary_items (activity_id);

-- ----- expenses -------------------------------------------------------------
CREATE TABLE expenses (
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
CREATE INDEX expenses_by_trip    ON expenses (trip_id);
CREATE INDEX expenses_by_paid_by ON expenses (paid_by);

COMMIT;
