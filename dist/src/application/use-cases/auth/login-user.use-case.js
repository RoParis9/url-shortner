"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
const session_entity_1 = require("../../../domain/entities/session.entity");
class LoginUserUseCase {
    constructor(userRepository, sessionRepository, passwordHasher, tokenGenerator) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.passwordHasher = passwordHasher;
        this.tokenGenerator = tokenGenerator;
    }
    async execute(request) {
        const { email, password, ipAddress, userAgent } = request;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await this.passwordHasher.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        const accessToken = this.tokenGenerator.generateAccessToken({
            userId: user.id,
            email: user.email
        });
        const refreshToken = this.tokenGenerator.generateRefreshToken({
            userId: user.id
        });
        const session = session_entity_1.Session.create(user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), ipAddress, userAgent);
        await this.sessionRepository.create(session);
        return {
            user,
            accessToken,
            refreshToken,
            expiresIn: 15 * 60
        };
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
//# sourceMappingURL=login-user.use-case.js.map