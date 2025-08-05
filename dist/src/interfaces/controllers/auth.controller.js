"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    constructor(registerUserUseCase, loginUserUseCase, refreshTokenUseCase, logoutUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
        this.logoutUserUseCase = logoutUserUseCase;
        this.register = async (req, res) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({ error: 'Email and password are required' });
                    return;
                }
                const result = await this.registerUserUseCase.execute({ email, password });
                res.status(201).json({
                    message: result.message,
                    user: {
                        id: result.user.id,
                        email: result.user.email,
                        createdAt: result.user.createdAt
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
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({ error: 'Email and password are required' });
                    return;
                }
                const result = await this.loginUserUseCase.execute({
                    email,
                    password,
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent')
                });
                res.status(200).json({
                    message: 'Login successful',
                    user: {
                        id: result.user.id,
                        email: result.user.email
                    },
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    expiresIn: result.expiresIn
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(401).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        };
        this.refresh = async (req, res) => {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    res.status(400).json({ error: 'Refresh token is required' });
                    return;
                }
                const result = await this.refreshTokenUseCase.execute({ refreshToken });
                res.status(200).json({
                    message: 'Token refreshed successfully',
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    expiresIn: result.expiresIn
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(401).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        };
        this.logout = async (req, res) => {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    res.status(400).json({ error: 'Refresh token is required' });
                    return;
                }
                const result = await this.logoutUserUseCase.execute({ refreshToken });
                res.status(200).json({ message: result.message });
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
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map