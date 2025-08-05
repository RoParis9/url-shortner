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

export class DeleteUserAccountUseCase {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(request: DeleteUserAccountRequest): Promise<DeleteUserAccountResponse> {
    const { userId, password } = request;

    // Get existing user
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Verify password using domain service
    const isPasswordValid = await this.passwordHasher.compare(password, existingUser.password);
    if (!isPasswordValid) {
      throw new Error('Password is incorrect');
    }

    // Delete all user sessions
    await this.sessionRepository.deleteByUserId(userId);

    // Delete user (this will cascade delete URLs and other related data)
    await this.userRepository.delete(userId);

    return {
      message: 'Account deleted successfully'
    };
  }
} 