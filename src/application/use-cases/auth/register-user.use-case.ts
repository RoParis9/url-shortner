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

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    const { email, password } = request;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create user entity with validation
    const user = User.create(email, password);

    // Hash password using domain service
    const hashedPassword = await this.passwordHasher.hash(user.getPasswordForHashing());
    const userWithHashedPassword = user.withHashedPassword(hashedPassword);

    // Save user
    const savedUser = await this.userRepository.create(userWithHashedPassword);

    return {
      user: savedUser,
      message: 'User registered successfully'
    };
  }
} 