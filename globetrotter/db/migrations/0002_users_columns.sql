-- =============================================================================
-- Migration 0002 — reshape users table to match auth spec.
-- Applies on top of v1 (db/schema.sql) which created users with display_name
-- and no is_active / updated_at / profile_image_url.
-- Run manually:
--   docker exec -i globetrotter-db psql -U yasha -d globetrotter \
--     < db/migrations/0002_users_columns.sql
-- =============================================================================

BEGIN;

-- 1. Rename display_name → full_name, drop NOT NULL so historical seed rows
--    that already had display_name still satisfy it (column now nullable).
ALTER TABLE users RENAME COLUMN display_name TO full_name;
ALTER TABLE users ALTER COLUMN full_name DROP NOT NULL;

-- 2. Add the new optional columns.
ALTER TABLE users ADD COLUMN profile_image_url text;
ALTER TABLE users ADD COLUMN is_active boolean NOT NULL DEFAULT true;
ALTER TABLE users ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

-- 3. updated_at auto-bump trigger.
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

COMMIT;
