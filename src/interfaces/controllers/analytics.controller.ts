import { Response } from 'express';
import { GetUrlAnalyticsUseCase } from '../../application/use-cases/analytics/get-url-analytics.use-case';
import { AuthenticatedRequest } from '../../infrastructure/middleware/auth.middleware';

export class AnalyticsController {
  constructor(
    private getUrlAnalyticsUseCase: GetUrlAnalyticsUseCase
  ) {}

  getUrlAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { urlId } = req.params;
      const { startDate, endDate, groupBy = 'day' } = req.query;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const result = await this.getUrlAnalyticsUseCase.execute({
        urlId,
        userId,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        groupBy: groupBy as 'day' | 'hour' | 'month'
      });

      res.status(200).json({
        message: 'Analytics retrieved successfully',
        url: result.url,
        analytics: {
          totalClicks: result.analytics.totalClicks,
          uniqueVisitors: result.analytics.uniqueVisitors,
          topReferrers: result.analytics.topReferrers,
          topUserAgents: result.analytics.topUserAgents,
          clicksByDate: result.analytics.clicksByDate,
          lastUpdated: result.analytics.lastUpdated
        },
        summary: result.summary,
        clicks: result.clicks.map(click => ({
          id: click.id,
          ipAddress: click.ipAddress,
          userAgent: click.userAgent,
          referer: click.referer,
          timestamp: click.timestamp
        }))
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // TODO: Add GetDashboardStatsUseCase
      res.status(200).json({
        message: 'Dashboard stats retrieved successfully',
        stats: {
          totalUrls: 0,
          totalClicks: 0,
          uniqueVisitors: 0,
          topPerformingUrls: []
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
} 