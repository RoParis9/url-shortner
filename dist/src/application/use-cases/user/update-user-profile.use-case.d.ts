import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { PasswordHasher } from '../../../domain/services/password-hasher.interface';
export interface UpdateUserProfileRequest {
    userId: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
}
export interface UpdateUserProfileResponse {
    user: User;
    message: string;
}
export declare class UpdateUserProfileUseCase {
    private userRepository;
    private passwordHasher;
    constructor(userRepository: UserRepository, passwordHasher: PasswordHasher);
    execute(request: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse>;
}
//# sourceMappingURL=update-user-profile.use-case.d.ts.map