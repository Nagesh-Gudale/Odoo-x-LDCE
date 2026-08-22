import type { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            user_id?: number;
            user_role?: "user" | "admin";
        }
    }
}
export declare function requireAuth(req: Request, res: Response, next: NextFunction): void;
export declare function requireAdmin(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map