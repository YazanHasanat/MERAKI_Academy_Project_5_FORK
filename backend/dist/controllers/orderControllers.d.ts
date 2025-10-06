import type { Request } from "express";
export interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
        email: string;
        firstName: string;
        lastName: string;
        role_id: number;
    };
}
//# sourceMappingURL=orderControllers.d.ts.map