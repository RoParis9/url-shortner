"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenUseCase = void 0;
class RefreshTokenUseCase {
    constructor(userRepository, sessionRepository, tokenGenerator) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.tokenGenerator = tokenGenerator;
    }
    async execute(request) {
        const { refreshToken } = request;
        try {
            const decoded = this.tokenGenerator.verifyToken(refreshToken, 'refresh');
            if (decoded.type !== 'refresh') {
                throw new Error('Invalid token type');
            }
            const session = await this.sessionRepository.findByToken(refreshToken);
            if (!session || session.isExpired()) {
                throw new Error('Invalid or expired refresh token');
            }
            const user = await this.userRepository.findById(decoded.userId);
            if (!user) {
                throw new Error('User not found');
            }
            const newAccessToken = this.tokenGenerator.generateAccessToken({
                userId: user.id,
                email: user.email
            });
            const newRefreshToken = this.tokenGenerator.generateRefreshToken({
                userId: user.id
            });
            const updatedSession = session.updateToken(newRefreshToken);
            await this.sessionRepository.update(updatedSession);
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                expiresIn: 15 * 60
            };
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}
exports.RefreshTokenUseCase = RefreshTokenUseCase;
//# sourceMappingURL=refresh-token.use-case.js.map