import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { AuthMiddleware } from '../../infrastructure/middleware/auth.middleware';

export function createAnalyticsRoutes(
  analyticsController: AnalyticsController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // All analytics routes require authentication
  router.use(authMiddleware.authenticate);

  // Analytics routes
  router.get('/urls/:urlId', analyticsController.getUrlAnalytics);
  router.get('/dashboard', analyticsController.getDashboardStats);

  return router;
} 