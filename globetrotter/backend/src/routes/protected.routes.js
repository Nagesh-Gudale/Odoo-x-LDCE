import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { pool } from "../db/pool.js";
const router = Router();
// Liveness probe — no auth, used to verify the server is up.
router.get("/ping", (_req, res) => {
    res.json({ ok: true });
});
// Demo protected route. Hits the DB to prove the JWT-decoded user_id works end-to-end.
router.get("/me", requireAuth, async (req, res) => {
    const userId = req.user_id;
    if (userId === undefined) {
        res.status(401).json({ error: "no user on request" });
        return;
    }
    const result = await pool.query(`SELECT user_id, email, full_name, role FROM users WHERE user_id = $1`, [userId]);
    const row = result.rows[0];
    if (!row) {
        res.status(404).json({ error: "user not found" });
        return;
    }
    res.json({ user: row });
});
export default router;
//# sourceMappingURL=protected.routes.js.map