"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = require("./infrastructure/swagger/swagger.config");
const container_1 = require("./infrastructure/container");
dotenv_1.default.config();
const app = (0, express_1.default)();
const container = container_1.Container.getInstance();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set('trust proxy', true);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'URL Shortener API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        docExpansion: 'list',
        defaultModelsExpandDepth: 1,
        defaultModelExpandDepth: 1,
        tryItOutEnabled: true
    }
}));
app.get('/docs', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>URL Shortener API - Scalar Documentation</title>
        <script id="api-reference" data-url="/api-docs/swagger.json"></script>
        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    </head>
    <body>
        <div id="api-reference"></div>
    </body>
    </html>
  `);
});
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
app.get('/', (req, res) => {
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
        documentation: {
            swagger: `${BASE_URL}/api-docs`,
            scalar: `${BASE_URL}/docs`,
            openapi: `${BASE_URL}/api-docs/swagger.json`
        }
    });
});
const authController = container.getAuthController();
const urlController = container.getUrlController();
const analyticsController = container.getAnalyticsController();
const userController = container.getUserController();
const authMiddleware = container.getAuthMiddleware();
app.post('/api/v1/auth/register', authController.register);
app.post('/api/v1/auth/login', authController.login);
app.post('/api/v1/auth/refresh', authController.refresh);
app.post('/api/v1/auth/logout', authMiddleware.authenticate, authController.logout);
app.get('/api/v1/users/profile', authMiddleware.authenticate, userController.getProfile);
app.put('/api/v1/users/profile', authMiddleware.authenticate, userController.updateProfile);
app.delete('/api/v1/users/account', authMiddleware.authenticate, userController.deleteAccount);
app.post('/api/v1/urls', authMiddleware.authenticate, urlController.createUrl);
app.get('/api/v1/urls', authMiddleware.authenticate, urlController.getUserUrls);
app.put('/api/v1/urls/:urlId', authMiddleware.authenticate, urlController.updateUrl);
app.delete('/api/v1/urls/:urlId', authMiddleware.authenticate, urlController.deleteUrl);
app.post('/api/v1/urls/public', urlController.createPublicUrl);
app.post('/api/v1/urls/bulk', authMiddleware.authenticate, urlController.bulkCreateUrls);
app.get('/api/v1/analytics/urls/:urlId', authMiddleware.authenticate, analyticsController.getUrlAnalytics);
app.get('/api/v1/analytics/dashboard', authMiddleware.authenticate, analyticsController.getDashboardStats);
app.get('/:shortCode', urlController.redirect);
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method
    });
});
async function startServer() {
    try {
        await container.getPrisma().$connect();
        console.log('✅ Database connected successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📝 API Documentation: ${BASE_URL}`);
            console.log(`🔗 Health Check: ${BASE_URL}/health`);
            console.log(`📚 Swagger UI: ${BASE_URL}/api-docs`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
process.on('SIGINT', async () => {
    console.log('🛑 Server shutting down gracefully');
    await container.disconnect();
    process.exit(0);
});
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled rejection:', reason);
    process.exit(1);
});
startServer();
//# sourceMappingURL=server.js.map