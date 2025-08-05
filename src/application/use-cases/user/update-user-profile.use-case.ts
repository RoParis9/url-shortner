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

export class UpdateUserProfileUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(request: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse> {
    const { userId, email, currentPassword, newPassword } = request;

    // Get existing user
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new Error('User not found');
    }

    let updatedUser = existingUser;

    // Update email if provided
    if (email && email !== existingUser.email) {
      // Check if email is already taken
      const userWithEmail = await this.userRepository.findByEmail(email);
      if (userWithEmail && userWithEmail.id !== userId) {
        throw new Error('Email is already taken');
      }

      updatedUser = updatedUser.updateEmail(email);
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        throw new Error('Current password is required to change password');
      }

      // Verify current password using domain service
      const isCurrentPasswordValid = await this.passwordHasher.compare(currentPassword, existingUser.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      updatedUser = updatedUser.updatePassword(newPassword);
      
      // Hash the new password using domain service
      const hashedPassword = await this.passwordHasher.hash(updatedUser.getPasswordForHashing());
      updatedUser = updatedUser.withHashedPassword(hashedPassword);
    }

    // Save updated user
    const savedUser = await this.userRepository.update(updatedUser);

    return {
      user: savedUser,
      message: 'Profile updated successfully'
    };
  }
} 