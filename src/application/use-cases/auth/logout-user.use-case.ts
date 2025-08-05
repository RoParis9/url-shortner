import { SessionRepository } from '../../../domain/repositories/session.repository.interface';

export interface LogoutUserRequest {
  refreshToken: string;
}

export interface LogoutUserResponse {
  message: string;
}

export class LogoutUserUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(request: LogoutUserRequest): Promise<LogoutUserResponse> {
    const { refreshToken } = request;

    const session = await this.sessionRepository.findByToken(refreshToken);
    if (session) {
      await this.sessionRepository.delete(session.id);
    }

    return {
      message: 'Logged out successfully'
    };
  }
} 