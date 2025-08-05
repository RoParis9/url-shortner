import { Request, Response, NextFunction } from 'express';
import { TokenGenerator } from '../../domain/services/token-generator.interface';
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        iat?: number;
        exp?: number;
    };
}
export interface TokenPayload {
    userId: string;
    email: string;
    type: 'access' | 'refresh';
    iat?: number;
    exp?: number;
}
export declare class AuthMiddleware {
    private tokenGenerator;
    constructor(tokenGenerator: TokenGenerator);
    authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    optional: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    requireAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    rateLimit: (maxAttempts?: number, windowMs?: number) => (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=auth.middleware.d.ts.map