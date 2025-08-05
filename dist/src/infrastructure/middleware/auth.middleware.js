"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
class AuthMiddleware {
    constructor(tokenGenerator) {
        this.tokenGenerator = tokenGenerator;
        this.authenticate = (req, res, next) => {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    res.status(401).json({
                        error: 'Authorization header required',
                        code: 'MISSING_AUTH_HEADER'
                    });
                    return;
                }
                if (!authHeader.startsWith('Bearer ')) {
                    res.status(401).json({
                        error: 'Invalid authorization format. Use Bearer token',
                        code: 'INVALID_AUTH_FORMAT'
                    });
                    return;
                }
                const token = authHeader.substring(7);
                if (!token || token.trim() === '') {
                    res.status(401).json({
                        error: 'Access token required',
                        code: 'MISSING_TOKEN'
                    });
                    return;
                }
                const decoded = this.tokenGenerator.verifyToken(token, 'access');
                if (!decoded) {
                    res.status(401).json({
                        error: 'Invalid token',
                        code: 'INVALID_TOKEN'
                    });
                    return;
                }
                if (decoded.type !== 'access') {
                    res.status(401).json({
                        error: 'Invalid token type. Access token required',
                        code: 'INVALID_TOKEN_TYPE'
                    });
                    return;
                }
                if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                    res.status(401).json({
                        error: 'Token expired',
                        code: 'TOKEN_EXPIRED'
                    });
                    return;
                }
                req.user = {
                    userId: decoded.userId,
                    email: decoded.email,
                    iat: decoded.iat,
                    exp: decoded.exp
                };
                next();
            }
            catch (error) {
                console.error('Authentication error:', error);
                res.status(401).json({
                    error: 'Invalid or expired token',
                    code: 'AUTHENTICATION_FAILED'
                });
            }
        };
        this.optional = (req, res, next) => {
            try {
                const authHeader = req.headers.authorization;
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    const token = authHeader.substring(7);
                    if (token && token.trim() !== '') {
                        const decoded = this.tokenGenerator.verifyToken(token, 'access');
                        if (decoded && decoded.type === 'access') {
                            if (!decoded.exp || Date.now() < decoded.exp * 1000) {
                                req.user = {
                                    userId: decoded.userId,
                                    email: decoded.email,
                                    iat: decoded.iat,
                                    exp: decoded.exp
                                };
                            }
                        }
                    }
                }
                next();
            }
            catch (error) {
                console.warn('Optional authentication failed:', error);
                next();
            }
        };
        this.requireAuth = (req, res, next) => {
            if (!req.user) {
                res.status(401).json({
                    error: 'Authentication required',
                    code: 'AUTHENTICATION_REQUIRED'
                });
                return;
            }
            next();
        };
        this.rateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
            const attempts = new Map();
            return (req, res, next) => {
                const ip = req.ip || req.connection.remoteAddress || 'unknown';
                const now = Date.now();
                const userAttempts = attempts.get(ip);
                if (userAttempts && now < userAttempts.resetTime) {
                    if (userAttempts.count >= maxAttempts) {
                        res.status(429).json({
                            error: 'Too many authentication attempts. Please try again later.',
                            code: 'RATE_LIMIT_EXCEEDED',
                            retryAfter: Math.ceil((userAttempts.resetTime - now) / 1000)
                        });
                        return;
                    }
                    userAttempts.count++;
                }
                else {
                    attempts.set(ip, { count: 1, resetTime: now + windowMs });
                }
                next();
            };
        };
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map