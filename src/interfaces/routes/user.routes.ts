import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware } from '../../infrastructure/middleware/auth.middleware';

export function createUserRoutes(
  userController: UserController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // All user routes require authentication
  router.use(authMiddleware.authenticate);

  // User profile routes
  router.get('/profile', userController.getProfile);
  router.put('/profile', userController.updateProfile);
  router.delete('/account', userController.deleteAccount);

  return router;
} 