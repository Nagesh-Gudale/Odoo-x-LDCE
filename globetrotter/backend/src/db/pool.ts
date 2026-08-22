import pg from "pg";
import { env } from "../config/env.js";

// One pool per process. `pg.Pool` handles connection lifecycle / recycling.
export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  // Tight defaults for a hackathon; tune up if you hit connection pressure.
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on("error", (err) => {
  // Don't crash the server on idle-client errors; just log.
  console.error("[pg pool] idle client error:", err);
});
