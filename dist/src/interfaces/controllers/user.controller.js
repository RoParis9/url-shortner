"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    constructor(updateUserProfileUseCase, deleteUserAccountUseCase) {
        this.updateUserProfileUseCase = updateUserProfileUseCase;
        this.deleteUserAccountUseCase = deleteUserAccountUseCase;
        this.updateProfile = async (req, res) => {
            try {
                const { email, currentPassword, newPassword } = req.body;
                const userId = req.user?.userId;
                if (!userId) {
                    res.status(401).json({ error: 'Authentication required' });
                    return;
                }
                const result = await this.updateUserProfileUseCase.execute({
                    userId,
                    email,
                    currentPassword,
                    newPassword
                });
                res.status(200).json({
                    message: result.message,
                    user: {
                        id: result.user.id,
                        email: result.user.email,
                        createdAt: result.user.createdAt,
                        updatedAt: result.user.updatedAt
                    }
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        };
        this.deleteAccount = async (req, res) => {
            try {
                const { password } = req.body;
                const userId = req.user?.userId;
                if (!userId) {
                    res.status(401).json({ error: 'Authentication required' });
                    return;
                }
                if (!password) {
                    res.status(400).json({ error: 'Password is required to delete account' });
                    return;
                }
                const result = await this.deleteUserAccountUseCase.execute({
                    userId,
                    password
                });
                res.status(200).json({
                    message: result.message
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        };
        this.getProfile = async (req, res) => {
            try {
                const userId = req.user?.userId;
                if (!userId) {
                    res.status(401).json({ error: 'Authentication required' });
                    return;
                }
                res.status(200).json({
                    message: 'Profile retrieved successfully',
                    user: {
                        id: userId,
                        email: req.user?.email
                    }
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map