import { Router } from 'express';
import { UrlController } from '../controllers/url.controller';
import { AuthMiddleware } from '../../infrastructure/middleware/auth.middleware';
export declare function createUrlRoutes(urlController: UrlController, authMiddleware: AuthMiddleware): Router;
//# sourceMappingURL=url.routes.d.ts.map