import { PrismaClient } from '@prisma/client';
import { Analytics } from '../../domain/entities/analytics.entity';
import { AnalyticsRepository } from '../../domain/repositories/analytics.repository.interface';
export declare class PrismaAnalyticsRepository implements AnalyticsRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    create(analytics: Analytics): Promise<Analytics>;
    findByUrlId(urlId: string): Promise<Analytics | null>;
    update(analytics: Analytics): Promise<Analytics>;
    delete(urlId: string): Promise<void>;
    updateFromClicks(urlId: string, clicks: any[]): Promise<Analytics>;
}
//# sourceMappingURL=prisma-analytics.repository.d.ts.map