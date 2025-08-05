import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { SessionRepository } from '../../../domain/repositories/session.repository.interface';
import { PasswordHasher } from '../../../domain/services/password-hasher.interface';
export interface DeleteUserAccountRequest {
    userId: string;
    password: string;
}
export interface DeleteUserAccountResponse {
    message: string;
}
export declare class DeleteUserAccountUseCase {
    private userRepository;
    private sessionRepository;
    private passwordHasher;
    constructor(userRepository: UserRepository, sessionRepository: SessionRepository, passwordHasher: PasswordHasher);
    execute(request: DeleteUserAccountRequest): Promise<DeleteUserAccountResponse>;
}
//# sourceMappingURL=delete-user-account.use-case.d.ts.map