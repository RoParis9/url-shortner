import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { PasswordHasher } from '../../../domain/services/password-hasher.interface';
export interface RegisterUserRequest {
    email: string;
    password: string;
}
export interface RegisterUserResponse {
    user: User;
    message: string;
}
export declare class RegisterUserUseCase {
    private userRepository;
    private passwordHasher;
    constructor(userRepository: UserRepository, passwordHasher: PasswordHasher);
    execute(request: RegisterUserRequest): Promise<RegisterUserResponse>;
}
//# sourceMappingURL=register-user.use-case.d.ts.map