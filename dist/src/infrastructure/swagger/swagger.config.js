"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'URL Shortener API',
            version: '1.0.0',
            description: 'A comprehensive URL shortening service with authentication, analytics, and user management',
            contact: {
                name: 'API Support',
                email: 'support@urlshortener.com',
                url: 'https://docs.urlshortener.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            },
            {
                url: 'https://api.urlshortener.com',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token for authentication'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'user123' },
                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Url: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'url123' },
                        originalUrl: { type: 'string', example: 'https://example.com/very-long-url' },
                        shortCode: { type: 'string', example: 'abc123' },
                        shortUrl: { type: 'string', example: 'http://localhost:3000/abc123' },
                        clicks: { type: 'integer', example: 0 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Error message' }
                    }
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        total: { type: 'integer', example: 100 },
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        totalPages: { type: 'integer', example: 10 }
                    }
                },
                Analytics: {
                    type: 'object',
                    properties: {
                        totalClicks: { type: 'integer', example: 150 },
                        uniqueVisitors: { type: 'integer', example: 120 },
                        topReferrers: { type: 'array', items: { type: 'string' } },
                        topUserAgents: { type: 'array', items: { type: 'string' } },
                        clicksByDate: { type: 'object', additionalProperties: { type: 'integer' } }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        './src/interfaces/controllers/*.ts',
        './src/interfaces/routes/*.ts',
        './src/application/use-cases/**/*.ts'
    ]
};
exports.specs = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.config.js.map