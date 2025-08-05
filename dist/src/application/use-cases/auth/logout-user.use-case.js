"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutUserUseCase = void 0;
class LogoutUserUseCase {
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    async execute(request) {
        const { refreshToken } = request;
        const session = await this.sessionRepository.findByToken(refreshToken);
        if (session) {
            await this.sessionRepository.delete(session.id);
        }
        return {
            message: 'Logged out successfully'
        };
    }
}
exports.LogoutUserUseCase = LogoutUserUseCase;
//# sourceMappingURL=logout-user.use-case.js.map