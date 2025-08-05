import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware } from '../../infrastructure/middleware/auth.middleware';
export declare function createUserRoutes(userController: UserController, authMiddleware: AuthMiddleware): Router;
//# sourceMappingURL=user.routes.d.ts.map