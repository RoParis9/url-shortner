import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/auth/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/auth/login-user.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case';
import { LogoutUserUseCase } from '../../application/use-cases/auth/logout-user.use-case';
export declare class AuthController {
    private registerUserUseCase;
    private loginUserUseCase;
    private refreshTokenUseCase;
    private logoutUserUseCase;
    constructor(registerUserUseCase: RegisterUserUseCase, loginUserUseCase: LoginUserUseCase, refreshTokenUseCase: RefreshTokenUseCase, logoutUserUseCase: LogoutUserUseCase);
    register: (req: Request, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    refresh: (req: Request, res: Response) => Promise<void>;
    logout: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map