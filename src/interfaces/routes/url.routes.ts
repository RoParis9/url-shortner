import { Router } from 'express';
import { UrlController } from '../controllers/url.controller';
import { AuthMiddleware } from '../../infrastructure/middleware/auth.middleware';

export function createUrlRoutes(
  urlController: UrlController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // Public routes (no authentication required)
  router.post('/public', urlController.createPublicUrl);
  router.get('/:shortCode', urlController.redirect);

  // Protected routes (authentication required)
  router.use(authMiddleware.authenticate);

  // URL management routes
  router.post('/', urlController.createUrl);
  router.get('/', urlController.getUserUrls);
  router.put('/:urlId', urlController.updateUrl);
  router.delete('/:urlId', urlController.deleteUrl);
  router.post('/bulk', urlController.bulkCreateUrls);

  return router;
} 