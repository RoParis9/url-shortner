import { Request, Response } from 'express';
import { CreateUrlUseCase } from '../../application/use-cases/url/create-url.use-case';
import { GetUserUrlsUseCase } from '../../application/use-cases/url/get-user-urls.use-case';
import { UpdateUrlUseCase } from '../../application/use-cases/url/update-url.use-case';
import { DeleteUrlUseCase } from '../../application/use-cases/url/delete-url.use-case';
import { RedirectUrlUseCase } from '../../application/use-cases/url/redirect-url.use-case';
import { BulkCreateUrlsUseCase } from '../../application/use-cases/bulk/bulk-create-urls.use-case';
import { AuthenticatedRequest } from '../../infrastructure/middleware/auth.middleware';
export declare class UrlController {
    private createUrlUseCase;
    private getUserUrlsUseCase;
    private updateUrlUseCase;
    private deleteUrlUseCase;
    private redirectUrlUseCase;
    private bulkCreateUrlsUseCase;
    constructor(createUrlUseCase: CreateUrlUseCase, getUserUrlsUseCase: GetUserUrlsUseCase, updateUrlUseCase: UpdateUrlUseCase, deleteUrlUseCase: DeleteUrlUseCase, redirectUrlUseCase: RedirectUrlUseCase, bulkCreateUrlsUseCase: BulkCreateUrlsUseCase);
    createUrl: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getUserUrls: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateUrl: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteUrl: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    redirect: (req: Request, res: Response) => Promise<void>;
    createPublicUrl: (req: Request, res: Response) => Promise<void>;
    bulkCreateUrls: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
//# sourceMappingURL=url.controller.d.ts.map