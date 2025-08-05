import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { SessionRepository } from '../../../domain/repositories/session.repository.interface';
import { PasswordHasher } from '../../../domain/services/password-hasher.interface';
import { TokenGenerator } from '../../../domain/services/token-generator.interface';
export interface LoginUserRequest {
    email: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
}
export interface LoginUserResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export declare class LoginUserUseCase {
    private userRepository;
    private sessionRepository;
    private passwordHasher;
    private tokenGenerator;
    constructor(userRepository: UserRepository, sessionRepository: SessionRepository, passwordHasher: PasswordHasher, tokenGenerator: TokenGenerator);
    execute(request: LoginUserRequest): Promise<LoginUserResponse>;
}
//# sourceMappingURL=login-user.use-case.d.ts.map