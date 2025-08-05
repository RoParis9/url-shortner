"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
class AnalyticsController {
    constructor(getUrlAnalyticsUseCase) {
        this.getUrlAnalyticsUseCase = getUrlAnalyticsUseCase;
        this.getUrlAnalytics = async (req, res) => {
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
                    startDate: startDate ? new Date(startDate) : undefined,
                    endDate: endDate ? new Date(endDate) : undefined,
                    groupBy: groupBy
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
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        };
        this.getDashboardStats = async (req, res) => {
            try {
                const userId = req.user?.userId;
                if (!userId) {
                    res.status(401).json({ error: 'Authentication required' });
                    return;
                }
                res.status(200).json({
                    message: 'Dashboard stats retrieved successfully',
                    stats: {
                        totalUrls: 0,
                        totalClicks: 0,
                        uniqueVisitors: 0,
                        topPerformingUrls: []
                    }
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        };
    }
}
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=analytics.controller.js.map