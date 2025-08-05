"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserProfileUseCase = void 0;
class UpdateUserProfileUseCase {
    constructor(userRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }
    async execute(request) {
        const { userId, email, currentPassword, newPassword } = request;
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new Error('User not found');
        }
        let updatedUser = existingUser;
        if (email && email !== existingUser.email) {
            const userWithEmail = await this.userRepository.findByEmail(email);
            if (userWithEmail && userWithEmail.id !== userId) {
                throw new Error('Email is already taken');
            }
            updatedUser = updatedUser.updateEmail(email);
        }
        if (newPassword) {
            if (!currentPassword) {
                throw new Error('Current password is required to change password');
            }
            const isCurrentPasswordValid = await this.passwordHasher.compare(currentPassword, existingUser.password);
            if (!isCurrentPasswordValid) {
                throw new Error('Current password is incorrect');
            }
            updatedUser = updatedUser.updatePassword(newPassword);
            const hashedPassword = await this.passwordHasher.hash(updatedUser.getPasswordForHashing());
            updatedUser = updatedUser.withHashedPassword(hashedPassword);
        }
        const savedUser = await this.userRepository.update(updatedUser);
        return {
            user: savedUser,
            message: 'Profile updated successfully'
        };
    }
}
exports.UpdateUserProfileUseCase = UpdateUserProfileUseCase;
//# sourceMappingURL=update-user-profile.use-case.js.map