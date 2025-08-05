import { SessionRepository } from '../../../domain/repositories/session.repository.interface';
export interface LogoutUserRequest {
    refreshToken: string;
}
export interface LogoutUserResponse {
    message: string;
}
export declare class LogoutUserUseCase {
    private sessionRepository;
    constructor(sessionRepository: SessionRepository);
    execute(request: LogoutUserRequest): Promise<LogoutUserResponse>;
}
//# sourceMappingURL=logout-user.use-case.d.ts.map