export type UserRole = "user" | "admin";
export interface JwtPayload {
    user_id: number;
    role: UserRole;
}
export declare function signAccessToken(payload: JwtPayload): string;
export declare function verifyAccessToken(token: string): JwtPayload;
//# sourceMappingURL=jwt.d.ts.map