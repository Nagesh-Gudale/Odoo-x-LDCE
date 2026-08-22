# GlobeTrotter — Hackathon MVP Foundation

Lean foundation only: Postgres schema, Docker for local infra, folder layout.
No backend/frontend code, no auth, no API yet.

## Layout

```
globetrotter/
├── db/
│   ├── schema.sql                # single-file DDL, applied on first `compose up`
│   └── migrations/               # empty; switch here if you adopt a migrations tool later
├── docker/
│   └── (reserved for compose overrides, prod compose, etc.)
├── docker-compose.yml            # postgres:16-alpine + placeholder backend service
├── .env.example                  # copy -> .env; holds DB creds
└── docs/
    └── architecture.md           # this rationale, expanded
```

`backend/` and `frontend/` directories are deliberately absent — drop them in at
the repo root when ready without restructuring anything here.

## Bring-up

```
cp .env.example .env
docker compose up -d db
docker compose exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\dt'
```

The schema is auto-applied via the entrypoint mount on first run only. If you
change `schema.sql` after that, run the apply command shown above manually (or
wipe the named volume: `docker compose down -v`).
