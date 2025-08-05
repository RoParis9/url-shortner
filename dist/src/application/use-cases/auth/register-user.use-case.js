"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const user_entity_1 = require("../../../domain/entities/user.entity");
class RegisterUserUseCase {
    constructor(userRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }
    async execute(request) {
        const { email, password } = request;
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const user = user_entity_1.User.create(email, password);
        const hashedPassword = await this.passwordHasher.hash(user.getPasswordForHashing());
        const userWithHashedPassword = user.withHashedPassword(hashedPassword);
        const savedUser = await this.userRepository.create(userWithHashedPassword);
        return {
            user: savedUser,
            message: 'User registered successfully'
        };
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
//# sourceMappingURL=register-user.use-case.js.map