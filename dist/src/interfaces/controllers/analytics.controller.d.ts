import { Response } from 'express';
import { GetUrlAnalyticsUseCase } from '../../application/use-cases/analytics/get-url-analytics.use-case';
import { AuthenticatedRequest } from '../../infrastructure/middleware/auth.middleware';
export declare class AnalyticsController {
    private getUrlAnalyticsUseCase;
    constructor(getUrlAnalyticsUseCase: GetUrlAnalyticsUseCase);
    getUrlAnalytics: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getDashboardStats: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
//# sourceMappingURL=analytics.controller.d.ts.map