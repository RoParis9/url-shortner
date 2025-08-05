import { Request, Response, NextFunction } from 'express';
import { TokenGenerator } from '../../domain/services/token-generator.interface';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
  };
}

export interface TokenPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export class AuthMiddleware {
  constructor(private tokenGenerator: TokenGenerator) {}

  /**
   * Middleware to authenticate requests using JWT access tokens
   * Requires a valid Bearer token in the Authorization header
   */
  authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      if (!token || token.trim() === '') {
        res.status(401).json({ 
          error: 'Access token required',
          code: 'MISSING_TOKEN'
        });
        return;
      }

      const decoded = this.tokenGenerator.verifyToken(token, 'access') as TokenPayload;
      
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

      // Check if token is expired
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
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ 
        error: 'Invalid or expired token',
        code: 'AUTHENTICATION_FAILED'
      });
    }
  };

  /**
   * Optional authentication middleware
   * Allows requests to proceed with or without authentication
   */
  optional = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        
        if (token && token.trim() !== '') {
          const decoded = this.tokenGenerator.verifyToken(token, 'access') as TokenPayload;
          
          if (decoded && decoded.type === 'access') {
            // Check if token is expired
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
    } catch (error) {
      // Continue without authentication for optional routes
      console.warn('Optional authentication failed:', error);
      next();
    }
  };

  /**
   * Middleware to check if user is authenticated
   * Returns 401 if no user is found in request
   */
  requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED'
      });
      return;
    }
    next();
  };

  /**
   * Middleware to rate limit authentication attempts
   */
  rateLimit = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
    const attempts = new Map<string, { count: number; resetTime: number }>();

    return (req: Request, res: Response, next: NextFunction): void => {
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
      } else {
        attempts.set(ip, { count: 1, resetTime: now + windowMs });
      }

      next();
    };
  };
} 