export interface TokenGenerator {
    generateAccessToken(payload: {
        userId: string;
        email: string;
    }): string;
    generateRefreshToken(payload: {
        userId: string;
    }): string;
    verifyToken(token: string, type: 'access' | 'refresh'): any;
}
//# sourceMappingURL=token-generator.interface.d.ts.map