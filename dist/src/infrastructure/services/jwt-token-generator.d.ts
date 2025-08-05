import { TokenGenerator } from '../../domain/services/token-generator.interface';
export declare class JwtTokenGenerator implements TokenGenerator {
    private readonly jwtSecret;
    private readonly jwtRefreshSecret;
    constructor(jwtSecret: string, jwtRefreshSecret: string);
    generateAccessToken(payload: {
        userId: string;
        email: string;
    }): string;
    generateRefreshToken(payload: {
        userId: string;
    }): string;
    verifyToken(token: string, type: 'access' | 'refresh'): any;
}
//# sourceMappingURL=jwt-token-generator.d.ts.map