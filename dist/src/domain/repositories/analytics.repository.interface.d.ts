import { Analytics } from '../entities/analytics.entity';
export interface AnalyticsRepository {
    create(analytics: Analytics): Promise<Analytics>;
    findByUrlId(urlId: string): Promise<Analytics | null>;
    update(analytics: Analytics): Promise<Analytics>;
    delete(urlId: string): Promise<void>;
    updateFromClicks(urlId: string, clicks: any[]): Promise<Analytics>;
}
//# sourceMappingURL=analytics.repository.interface.d.ts.map