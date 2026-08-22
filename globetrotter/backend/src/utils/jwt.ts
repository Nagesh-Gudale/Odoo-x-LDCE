import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type UserRole = "user" | "admin";

export interface JwtPayload {
  user_id: number;
  role: UserRole;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  // Throws on invalid/expired; callers (auth middleware) catch and 401.
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
