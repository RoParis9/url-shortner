import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './infrastructure/swagger/swagger.config';

import { Container } from './infrastructure/container';

// Load environment variables
dotenv.config();

const app = express();
const container = Container.getInstance();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy for IP address detection
app.set('trust proxy', true);



// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
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


// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});



// Root endpoint
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
      openapi: `${BASE_URL}/api-docs/swagger.json`
    }
  });
});

// Wire up controllers with dependency injection
const authController = container.getAuthController();
const urlController = container.getUrlController();
const analyticsController = container.getAnalyticsController();
const userController = container.getUserController();
const authMiddleware = container.getAuthMiddleware();

// Auth routes
app.post('/api/v1/auth/register', authController.register);
app.post('/api/v1/auth/login', authController.login);
app.post('/api/v1/auth/refresh', authController.refresh);
app.post('/api/v1/auth/logout', authMiddleware.authenticate, authController.logout);

// User routes (authenticated)
app.get('/api/v1/users/profile', authMiddleware.authenticate, userController.getProfile);
app.put('/api/v1/users/profile', authMiddleware.authenticate, userController.updateProfile);
app.delete('/api/v1/users/account', authMiddleware.authenticate, userController.deleteAccount);

// URL routes
app.post('/api/v1/urls', authMiddleware.authenticate, urlController.createUrl);
app.get('/api/v1/urls', authMiddleware.authenticate, urlController.getUserUrls);
app.put('/api/v1/urls/:urlId', authMiddleware.authenticate, urlController.updateUrl);
app.delete('/api/v1/urls/:urlId', authMiddleware.authenticate, urlController.deleteUrl);
app.post('/api/v1/urls/public', urlController.createPublicUrl);
app.post('/api/v1/urls/bulk', authMiddleware.authenticate, urlController.bulkCreateUrls);

// Analytics routes (authenticated)
app.get('/api/v1/analytics/urls/:urlId', authMiddleware.authenticate, analyticsController.getUrlAnalytics);
app.get('/api/v1/analytics/dashboard', authMiddleware.authenticate, analyticsController.getDashboardStats);

// Redirect route (public)
app.get('/:shortCode', urlController.redirect);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});



// Start server
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
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
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
