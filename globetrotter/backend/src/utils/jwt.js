import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export function signAccessToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });
}
export function verifyAccessToken(token) {
    // Throws on invalid/expired; callers (auth middleware) catch and 401.
    return jwt.verify(token, env.JWT_SECRET);
}
//# sourceMappingURL=jwt.js.map