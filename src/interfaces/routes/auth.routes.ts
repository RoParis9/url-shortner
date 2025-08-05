import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  // Public auth routes
  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.post('/refresh', authController.refresh);
  router.post('/logout', authController.logout);

  return router;
} 