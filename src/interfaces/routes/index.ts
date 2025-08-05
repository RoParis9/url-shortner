import { Router } from 'express';
import { createAuthRoutes } from '../routes/auth.routes';
import { createUserRoutes } from '../routes/user.routes';
import { createUrlRoutes } from '../routes/url.routes';
import { createAnalyticsRoutes } from '../routes/analytics.routes';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { UrlController } from '../controllers/url.controller';
import { AnalyticsController } from '../controllers/analytics.controller';
import { AuthMiddleware } from '../../infrastructure/middleware/auth.middleware';

export function createRoutes(
  authController: AuthController,
  userController: UserController,
  urlController: UrlController,
  analyticsController: AnalyticsController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // API versioning
  router.use('/api/v1', (req, res, next) => {
    (req as any).apiVersion = 'v1';
    next();
  });

  // Health check
  router.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // API routes
  router.use('/api/v1/auth', createAuthRoutes(authController));
  router.use('/api/v1/users', createUserRoutes(userController, authMiddleware));
  router.use('/api/v1/urls', createUrlRoutes(urlController, authMiddleware));
  router.use('/api/v1/analytics', createAnalyticsRoutes(analyticsController, authMiddleware));

  // Root endpoint
  router.get('/', (req, res) => {
    res.json({
      message: 'URL Shortener API',
      version: '1.0.0',
      endpoints: {
        auth: '/api/v1/auth',
        users: '/api/v1/users',
        urls: '/api/v1/urls',
        analytics: '/api/v1/analytics',
        health: '/health'
      },
      documentation: 'https://docs.urlshortener.com'
    });
  });

  // 404 handler
  router.use('*', (req, res) => {
    res.status(404).json({
      error: 'Endpoint not found',
      path: req.originalUrl,
      method: req.method
    });
  });

  return router;
} 