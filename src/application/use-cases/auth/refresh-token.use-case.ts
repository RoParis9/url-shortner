import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { SessionRepository } from '../../../domain/repositories/session.repository.interface';
import { TokenGenerator } from '../../../domain/services/token-generator.interface';

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class RefreshTokenUseCase {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
    private tokenGenerator: TokenGenerator
  ) {}

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const { refreshToken } = request;

    try {
      // Verify refresh token using domain service
      const decoded = this.tokenGenerator.verifyToken(refreshToken, 'refresh');
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Check if session exists and is not expired
      const session = await this.sessionRepository.findByToken(refreshToken);
      if (!session || session.isExpired()) {
        throw new Error('Invalid or expired refresh token');
      }

      // Get user
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens using domain service
      const newAccessToken = this.tokenGenerator.generateAccessToken({
        userId: user.id,
        email: user.email
      });
      const newRefreshToken = this.tokenGenerator.generateRefreshToken({
        userId: user.id
      });

      // Update session with new refresh token
      const updatedSession = session.updateToken(newRefreshToken);
      await this.sessionRepository.update(updatedSession);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 15 * 60 // 15 minutes
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
} 