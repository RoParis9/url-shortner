import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { AuthMiddleware } from '../../infrastructure/middleware/auth.middleware';
export declare function createAnalyticsRoutes(analyticsController: AnalyticsController, authMiddleware: AuthMiddleware): Router;
//# sourceMappingURL=analytics.routes.d.ts.map