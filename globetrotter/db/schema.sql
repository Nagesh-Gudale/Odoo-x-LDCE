-- =============================================================================
-- GlobeTrotter — foundational Postgres schema (hackathon MVP)
-- Single-file DDL. Run order: users → cities → activities → trips → stops →
-- stop_activities. Drop into a fresh DB; no migrations tool assumed yet.
-- =============================================================================

BEGIN;

-- ----- Extensions ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()

-- ----- Enums -----------------------------------------------------------------
-- Kept inline (CHECK) rather than CREATE TYPE so a future migration can ALTER
-- without ceremony. Hackathon speed > strict typing.

-- ----- users -----------------------------------------------------------------
CREATE TABLE users (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email           text NOT NULL UNIQUE,
    display_name    text NOT NULL,
    password_hash   text NOT NULL,           -- backend fills this; schema stays auth-agnostic
    created_at      timestamptz NOT NULL DEFAULT now()
);

-- ----- cities (reference / lookup) -------------------------------------------
-- Separate table (not embedded in stops) so we can dedupe, attach cost_index +
-- popularity once, and join cheaply. Activities live in one place per city.
CREATE TABLE cities (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name            text NOT NULL,
    country         text NOT NULL,
    cost_index      numeric(6,2) NOT NULL DEFAULT 1.00,   -- multiplier vs baseline; e.g. 1.25
    popularity      integer NOT NULL DEFAULT 0,           -- 0..100; ranking/sort only
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (name, country)
);

-- ----- activities (catalog, scoped to a city) --------------------------------
-- Living in their own table (per-city) lets us list "what's there to do" without
-- fanning out across stops; cost/duration are NUMERIC so budget math is exact.
CREATE TABLE activities (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id         uuid NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name            text NOT NULL,
    category        text NOT NULL,                          -- food / sights / nature / ...
    cost            numeric(10,2) NOT NULL DEFAULT 0,       -- per-person, in trip currency
    duration_mins   integer NOT NULL DEFAULT 60 CHECK (duration_mins >= 0),
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (city_id, name)
);
CREATE INDEX activities_by_city ON activities (city_id);

-- ----- trips -----------------------------------------------------------------
CREATE TABLE trips (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            text NOT NULL,
    description     text,
    start_date      date NOT NULL,
    end_date        date NOT NULL,
    is_public       boolean NOT NULL DEFAULT false,         -- see rationale: sharing model
    created_at      timestamptz NOT NULL DEFAULT now(),
    CHECK (end_date >= start_date)
);
CREATE INDEX trips_by_owner ON trips (owner_id);

-- ----- trip_collaborators (sharing, kept minimal) ----------------------------
-- Owner is on `trips.owner_id`; collaborators are a separate row each. Supports
-- the "shared trip" mention without inventing a full RBAC model.
CREATE TABLE trip_collaborators (
    trip_id         uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            text NOT NULL DEFAULT 'editor'
                    CHECK (role IN ('viewer', 'editor')),
    added_at        timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (trip_id, user_id)
);
CREATE INDEX trip_collabs_by_user ON trip_collaborators (user_id);

-- ----- stops (a city visited during a trip, in order) ------------------------
-- One row per (trip, city). `seq` preserves ordering; `position`-only would lose
-- stable sort across equal values.
CREATE TABLE stops (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id         uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    city_id         uuid NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    start_date      date NOT NULL,
    end_date        date NOT NULL,
    seq             integer NOT NULL,                       -- 0-based order within trip
    created_at      timestamptz NOT NULL DEFAULT now(),
    CHECK (end_date >= start_date),
    CHECK (seq >= 0),
    UNIQUE (trip_id, seq),                                  -- no two stops share order
    UNIQUE (trip_id, city_id)                               -- one row per city per trip
);
CREATE INDEX stops_by_trip ON stops (trip_id);
CREATE INDEX stops_by_city ON stops (city_id);

-- ----- stop_activities (join: which activities on which stop, when) ----------
-- The join table the spec asks for. Holds scheduling + per-stop overrides
-- (e.g. "2 tickets", "skip"), and is what the budget query aggregates over.
CREATE TABLE stop_activities (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    stop_id         uuid NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
    activity_id     uuid NOT NULL REFERENCES activities(id) ON DELETE RESTRICT,
    scheduled_day   date,                                   -- nullable = "sometime in this stop"
    scheduled_time  time,                                   -- optional time-of-day
    quantity        integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
    override_cost   numeric(10,2),                          -- optional per-stop price override
    note            text,
    created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX stop_activities_by_stop ON stop_activities (stop_id);
CREATE INDEX stop_activities_by_activity ON stop_activities (activity_id);

COMMIT;
