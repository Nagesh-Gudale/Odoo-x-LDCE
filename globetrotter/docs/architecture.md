# GlobeTrotter — Architecture Rationale

## Schema shape

- **UUID PKs everywhere** — opaque, safe to expose in URLs/IDs, no leaking of row
  counts. `pgcrypto` gives us `gen_random_uuid()`; one extra extension, zero
  hassle. Serial/BIGSERIAL would be marginally smaller but force IDs into URLs
  and leak scale. Not worth it for an MVP.
- **`cities` is a reference table, not embedded** — same city appears across
  many trips; storing `cost_index` and `popularity` once and joining is cheaper
  than denormalizing and reconciling later. Activities also live per-city, so a
  future "what's there to do in Tokyo" query is one index lookup.
- **`stops` is a separate table from `cities` and from `trips`** — it's a real
  entity: it carries per-trip dates, ordering (`seq`), and the constraint that
  one city appears at most once per trip (`UNIQUE (trip_id, city_id)`). If we
  ever allow revisits, drop that constraint rather than reshaping the table.
- **`stop_activities` is a join, not a flag on `activities`** — many-to-many
  with scheduling + per-stop overrides (`quantity`, `override_cost`, `note`).
  This is also the table the budget calculation aggregates over; one place to
  read, one place to extend.
- **`trip_collaborators` is its own table** — supports the "shared itinerary"
  mention in the spec without inventing roles, ACLs, or invitation flows.
- **`users.password_hash` lives on the row** — schema stays auth-agnostic; any
  backend can fill it (argon2, bcrypt, magic-link). No `password_hash BYTEA`
  contortions.
- **Budget is derived, not snapshotted** — summing `activities.cost *
  stop_activities.quantity` (or `override_cost` when present) is a single
  query; snapshots add a write path, sync problems, and stale numbers. Spec
  didn't ask for history, so we don't pay for it.
- **CHECK-enums instead of `CREATE TYPE`** — easier to ALTER later if a new
  role/category shows up. Hackathon-speed tradeoff.

## Sharing model — explicit assumption

Spec said "public/shared flag" without specifying semantics. I'm assuming:
- `trips.is_public` = "read-only discoverable link to anyone with the trip id."
- `trip_collaborators` = explicit invites with `viewer` / `editor` roles.
- No per-row ACLs, no group trips, no comments. That's a v2 conversation.

## Indexes — what got one, what didn't

- `trips(owner_id)` — every dashboard list starts here.
- `stops(trip_id)`, `stops(city_id)` — both are obvious access paths.
- `activities(city_id)` — "things to do in city X" is a near-certain query.
- `stop_activities(stop_id)`, `stop_activities(activity_id)` — both directions
  needed (budget per stop, "which trips use this activity").
- `trip_collaborators(user_id)` — "trips shared with me" view.
- **No** composite indexes, **no** GIN, **no** covering indexes. Premature for
  MVP. Add `EXPLAIN ANALYZE` output when a query actually hurts.

## Hackathon simplifications (and what to add later)

- **Single `schema.sql`, no migrations tool yet** — fastest path to a working
  DB. Switch to `db/migrations/0001_init.sql`, `0002_*.sql`, ... once the
  backend is in and we need to ship schema changes without nuking dev volumes.
- **No `updated_at`, no `deleted_at` (soft delete)** — pure MVP. Add
  `updated_at timestamptz` on every table when we need audit trails; add soft
  deletes if a user accidentally trashes a planned trip.
- **No `currencies` / FX** — costs stored as NUMERIC in an implicit base
  currency. Add a `currencies` table + a `cost_currency` column later.
- **No `tags` on activities** — `category` is one value. Move to a join table
  only if search-by-multiple-tags becomes a real feature.
- **No budget snapshots** — see above; flip to snapshotting only if a "share
  budget snapshot at this point in time" requirement shows up.
- **No images / media URLs** — none in spec; add `media` table with FK to
  cities/activities/stops when needed.
- **`password_hash` column included** — small forward-compat win so the auth
  step doesn't need a migration just to land.
