import { Response } from 'express';
import { UpdateUserProfileUseCase } from '../../application/use-cases/user/update-user-profile.use-case';
import { DeleteUserAccountUseCase } from '../../application/use-cases/user/delete-user-account.use-case';
import { AuthenticatedRequest } from '../../infrastructure/middleware/auth.middleware';
export declare class UserController {
    private updateUserProfileUseCase;
    private deleteUserAccountUseCase;
    constructor(updateUserProfileUseCase: UpdateUserProfileUseCase, deleteUserAccountUseCase: DeleteUserAccountUseCase);
    updateProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteAccount: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map