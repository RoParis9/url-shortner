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

export class GetUrlAnalyticsUseCase {
  constructor(
    private urlRepository: UrlRepository,
    private clickRepository: ClickRepository,
    private analyticsRepository: AnalyticsRepository
  ) {}

  async execute(request: GetUrlAnalyticsRequest): Promise<GetUrlAnalyticsResponse> {
    const { urlId, userId, startDate, endDate, groupBy = 'day' } = request;

    // Get URL and check ownership
    const url = await this.urlRepository.findById(urlId);
    if (!url) {
      throw new Error('URL not found');
    }

    if (url.userId !== userId) {
      throw new Error('Unauthorized to view analytics for this URL');
    }

    // Get analytics
    const analytics = await this.analyticsRepository.findByUrlId(urlId);
    if (!analytics) {
      throw new Error('Analytics not found');
    }

    // Get clicks with date filtering
    const clicks = await this.clickRepository.findByUrlId(urlId, {
      startDate,
      endDate,
      groupBy
    });

    // Calculate summary
    const uniqueIPs = new Set(clicks.map(c => c.ipAddress).filter(Boolean));
    const referrers = clicks.map(c => c.referer).filter(Boolean);
    const userAgents = clicks.map(c => c.userAgent).filter(Boolean);

    const clicksByDate = this.groupClicksByDate(clicks, groupBy);
    const topReferrers = this.getTopItems(referrers.filter(Boolean) as string[], 5);
    const topUserAgents = this.getTopItems(userAgents.filter(Boolean) as string[], 5);

    const daysDiff = startDate && endDate 
      ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 30;

    return {
      url: {
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        clicks: url.clicks,
        createdAt: url.createdAt
      },
      analytics,
      clicks,
      summary: {
        totalClicks: clicks.length,
        uniqueVisitors: uniqueIPs.size,
        averageClicksPerDay: clicks.length / Math.max(daysDiff, 1),
        topReferrers,
        topUserAgents,
        clicksByDate
      }
    };
  }

  private groupClicksByDate(clicks: Click[], groupBy: string): Record<string, number> {
    const grouped: Record<string, number> = {};

    clicks.forEach(click => {
      let key: string;
      
      switch (groupBy) {
        case 'hour':
          key = click.timestamp.toISOString().slice(0, 13) + ':00:00.000Z';
          break;
        case 'month':
          key = click.timestamp.toISOString().slice(0, 7);
          break;
        default: // day
          key = click.timestamp.toISOString().slice(0, 10);
      }

      grouped[key] = (grouped[key] || 0) + 1;
    });

    return grouped;
  }

  private getTopItems(items: string[], limit: number): string[] {
    const counts = items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([item]) => item);
  }
} 