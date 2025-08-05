import jwt from 'jsonwebtoken';
import { TokenGenerator } from '../../domain/services/token-generator.interface';

export class JwtTokenGenerator implements TokenGenerator {
  constructor(
    private readonly jwtSecret: string,
    private readonly jwtRefreshSecret: string
  ) {}

  generateAccessToken(payload: { userId: string; email: string }): string {
    return jwt.sign(
      {
        ...payload,
        type: 'access'
      },
      this.jwtSecret,
      { expiresIn: '15m' }
    );
  }

  generateRefreshToken(payload: { userId: string }): string {
    return jwt.sign(
      {
        ...payload,
        type: 'refresh'
      },
      this.jwtRefreshSecret,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token: string, type: 'access' | 'refresh'): any {
    const secret = type === 'access' ? this.jwtSecret : this.jwtRefreshSecret;
    return jwt.verify(token, secret);
  }
} 