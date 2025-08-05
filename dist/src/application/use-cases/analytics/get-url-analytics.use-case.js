"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUrlAnalyticsUseCase = void 0;
class GetUrlAnalyticsUseCase {
    constructor(urlRepository, clickRepository, analyticsRepository) {
        this.urlRepository = urlRepository;
        this.clickRepository = clickRepository;
        this.analyticsRepository = analyticsRepository;
    }
    async execute(request) {
        const { urlId, userId, startDate, endDate, groupBy = 'day' } = request;
        const url = await this.urlRepository.findById(urlId);
        if (!url) {
            throw new Error('URL not found');
        }
        if (url.userId !== userId) {
            throw new Error('Unauthorized to view analytics for this URL');
        }
        const analytics = await this.analyticsRepository.findByUrlId(urlId);
        if (!analytics) {
            throw new Error('Analytics not found');
        }
        const clicks = await this.clickRepository.findByUrlId(urlId, {
            startDate,
            endDate,
            groupBy
        });
        const uniqueIPs = new Set(clicks.map(c => c.ipAddress).filter(Boolean));
        const referrers = clicks.map(c => c.referer).filter(Boolean);
        const userAgents = clicks.map(c => c.userAgent).filter(Boolean);
        const clicksByDate = this.groupClicksByDate(clicks, groupBy);
        const topReferrers = this.getTopItems(referrers.filter(Boolean), 5);
        const topUserAgents = this.getTopItems(userAgents.filter(Boolean), 5);
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
    groupClicksByDate(clicks, groupBy) {
        const grouped = {};
        clicks.forEach(click => {
            let key;
            switch (groupBy) {
                case 'hour':
                    key = click.timestamp.toISOString().slice(0, 13) + ':00:00.000Z';
                    break;
                case 'month':
                    key = click.timestamp.toISOString().slice(0, 7);
                    break;
                default:
                    key = click.timestamp.toISOString().slice(0, 10);
            }
            grouped[key] = (grouped[key] || 0) + 1;
        });
        return grouped;
    }
    getTopItems(items, limit) {
        const counts = items.reduce((acc, item) => {
            acc[item] = (acc[item] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([item]) => item);
    }
}
exports.GetUrlAnalyticsUseCase = GetUrlAnalyticsUseCase;
//# sourceMappingURL=get-url-analytics.use-case.js.map