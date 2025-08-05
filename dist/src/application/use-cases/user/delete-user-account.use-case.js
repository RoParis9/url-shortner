"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserAccountUseCase = void 0;
class DeleteUserAccountUseCase {
    constructor(userRepository, sessionRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.passwordHasher = passwordHasher;
    }
    async execute(request) {
        const { userId, password } = request;
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new Error('User not found');
        }
        const isPasswordValid = await this.passwordHasher.compare(password, existingUser.password);
        if (!isPasswordValid) {
            throw new Error('Password is incorrect');
        }
        await this.sessionRepository.deleteByUserId(userId);
        await this.userRepository.delete(userId);
        return {
            message: 'Account deleted successfully'
        };
    }
}
exports.DeleteUserAccountUseCase = DeleteUserAccountUseCase;
//# sourceMappingURL=delete-user-account.use-case.js.map