import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { UrlController } from '../controllers/url.controller';
import { AnalyticsController } from '../controllers/analytics.controller';
import { AuthMiddleware } from '../../infrastructure/middleware/auth.middleware';
export declare function createRoutes(authController: AuthController, userController: UserController, urlController: UrlController, analyticsController: AnalyticsController, authMiddleware: AuthMiddleware): Router;
//# sourceMappingURL=index.d.ts.map