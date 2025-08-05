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
export declare class RefreshTokenUseCase {
    private userRepository;
    private sessionRepository;
    private tokenGenerator;
    constructor(userRepository: UserRepository, sessionRepository: SessionRepository, tokenGenerator: TokenGenerator);
    execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse>;
}
//# sourceMappingURL=refresh-token.use-case.d.ts.map