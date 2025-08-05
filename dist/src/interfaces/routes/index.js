"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoutes = createRoutes;
const express_1 = require("express");
const auth_routes_1 = require("../routes/auth.routes");
const user_routes_1 = require("../routes/user.routes");
const url_routes_1 = require("../routes/url.routes");
const analytics_routes_1 = require("../routes/analytics.routes");
function createRoutes(authController, userController, urlController, analyticsController, authMiddleware) {
    const router = (0, express_1.Router)();
    router.use('/api/v1', (req, res, next) => {
        req.apiVersion = 'v1';
        next();
    });
    router.get('/health', (req, res) => {
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    });
    router.use('/api/v1/auth', (0, auth_routes_1.createAuthRoutes)(authController));
    router.use('/api/v1/users', (0, user_routes_1.createUserRoutes)(userController, authMiddleware));
    router.use('/api/v1/urls', (0, url_routes_1.createUrlRoutes)(urlController, authMiddleware));
    router.use('/api/v1/analytics', (0, analytics_routes_1.createAnalyticsRoutes)(analyticsController, authMiddleware));
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
    router.use('*', (req, res) => {
        res.status(404).json({
            error: 'Endpoint not found',
            path: req.originalUrl,
            method: req.method
        });
    });
    return router;
}
//# sourceMappingURL=index.js.map