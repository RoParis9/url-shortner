import { PrismaClient } from '@prisma/client';
import { Analytics } from '../../domain/entities/analytics.entity';
import { AnalyticsRepository } from '../../domain/repositories/analytics.repository.interface';

export class PrismaAnalyticsRepository implements AnalyticsRepository {
  constructor(private prisma: PrismaClient) {}

  async create(analytics: Analytics): Promise<Analytics> {
    const createdAnalytics = await this.prisma.analytics.create({
      data: {
        id: analytics.id,
        urlId: analytics.urlId,
        totalClicks: analytics.totalClicks,
        uniqueVisitors: analytics.uniqueVisitors,
        topReferrers: analytics.topReferrers,
        topUserAgents: analytics.topUserAgents,
        clicksByDate: analytics.clicksByDate,
        lastUpdated: analytics.lastUpdated
      }
    });

    return new Analytics(
      createdAnalytics.id,
      createdAnalytics.urlId,
      createdAnalytics.totalClicks,
      createdAnalytics.uniqueVisitors,
      createdAnalytics.topReferrers,
      createdAnalytics.topUserAgents,
      createdAnalytics.clicksByDate as Record<string, number>,
      createdAnalytics.lastUpdated
    );
  }

  async findByUrlId(urlId: string): Promise<Analytics | null> {
    const analytics = await this.prisma.analytics.findUnique({
      where: { urlId }
    });

    if (!analytics) return null;

    return new Analytics(
      analytics.id,
      analytics.urlId,
      analytics.totalClicks,
      analytics.uniqueVisitors,
      analytics.topReferrers,
      analytics.topUserAgents,
      analytics.clicksByDate as Record<string, number>,
      analytics.lastUpdated
    );
  }

  async update(analytics: Analytics): Promise<Analytics> {
    const updatedAnalytics = await this.prisma.analytics.update({
      where: { urlId: analytics.urlId },
      data: {
        totalClicks: analytics.totalClicks,
        uniqueVisitors: analytics.uniqueVisitors,
        topReferrers: analytics.topReferrers,
        topUserAgents: analytics.topUserAgents,
        clicksByDate: analytics.clicksByDate,
        lastUpdated: analytics.lastUpdated
      }
    });

    return new Analytics(
      updatedAnalytics.id,
      updatedAnalytics.urlId,
      updatedAnalytics.totalClicks,
      updatedAnalytics.uniqueVisitors,
      updatedAnalytics.topReferrers,
      updatedAnalytics.topUserAgents,
      updatedAnalytics.clicksByDate as Record<string, number>,
      updatedAnalytics.lastUpdated
    );
  }

  async delete(urlId: string): Promise<void> {
    await this.prisma.analytics.delete({
      where: { urlId }
    });
  }

  async updateFromClicks(urlId: string, clicks: any[]): Promise<Analytics> {
    // Get existing analytics or create new one
    let analytics = await this.findByUrlId(urlId);
    
    if (!analytics) {
      analytics = Analytics.create(urlId);
      analytics = await this.create(analytics);
    }

    // Update analytics from clicks data
    const updatedAnalytics = analytics.updateFromClicks(clicks);
    return this.update(updatedAnalytics);
  }
} 