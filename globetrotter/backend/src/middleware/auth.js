import { verifyAccessToken } from "../utils/jwt.js";
export function requireAuth(req, res, next) {
    const header = req.header("authorization") ?? req.header("Authorization");
    if (!header || !header.toLowerCase().startsWith("bearer ")) {
        res.status(401).json({ error: "missing bearer token" });
        return;
    }
    const token = header.slice("bearer ".length).trim();
    if (token.length === 0) {
        res.status(401).json({ error: "missing bearer token" });
        return;
    }
    try {
        const payload = verifyAccessToken(token);
        req.user_id = payload.user_id;
        req.user_role = payload.role;
        next();
    }
    catch {
        res.status(401).json({ error: "invalid or expired token" });
    }
}
export function requireAdmin(req, res, next) {
    if (req.user_role !== "admin") {
        res.status(403).json({ error: "admin access required" });
        return;
    }
    next();
}
//# sourceMappingURL=auth.js.map