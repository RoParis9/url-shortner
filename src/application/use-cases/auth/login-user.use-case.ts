import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { SessionRepository } from '../../../domain/repositories/session.repository.interface';
import { Session } from '../../../domain/entities/session.entity';
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

export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
    private passwordHasher: PasswordHasher,
    private tokenGenerator: TokenGenerator
  ) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
    const { email, password, ipAddress, userAgent } = request;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password using domain service
    const isPasswordValid = await this.passwordHasher.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens using domain service
    const accessToken = this.tokenGenerator.generateAccessToken({
      userId: user.id,
      email: user.email
    });
    const refreshToken = this.tokenGenerator.generateRefreshToken({
      userId: user.id
    });

    // Create session
    const session = Session.create(
      user.id,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress,
      userAgent
    );

    await this.sessionRepository.create(session);

    return {
      user,
      accessToken,
      refreshToken,
      expiresIn: 15 * 60 // 15 minutes
    };
  }
} 