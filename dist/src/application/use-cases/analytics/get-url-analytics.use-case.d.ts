import { Click } from '../../../domain/entities/click.entity';
import { Analytics } from '../../../domain/entities/analytics.entity';
import { ClickRepository } from '../../../domain/repositories/click.repository.interface';
import { AnalyticsRepository } from '../../../domain/repositories/analytics.repository.interface';
import { UrlRepository } from '../../../domain/repositories/url.repository.interface';
export interface GetUrlAnalyticsRequest {
    urlId: string;
    userId: string;
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'day' | 'hour' | 'month';
}
export interface GetUrlAnalyticsResponse {
    url: any;
    analytics: Analytics;
    clicks: Click[];
    summary: {
        totalClicks: number;
        uniqueVisitors: number;
        averageClicksPerDay: number;
        topReferrers: string[];
        topUserAgents: string[];
        clicksByDate: Record<string, number>;
    };
}
export declare class GetUrlAnalyticsUseCase {
    private urlRepository;
    private clickRepository;
    private analyticsRepository;
    constructor(urlRepository: UrlRepository, clickRepository: ClickRepository, analyticsRepository: AnalyticsRepository);
    execute(request: GetUrlAnalyticsRequest): Promise<GetUrlAnalyticsResponse>;
    private groupClicksByDate;
    private getTopItems;
}
//# sourceMappingURL=get-url-analytics.use-case.d.ts.map