"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAnalyticsRepository = void 0;
const analytics_entity_1 = require("../../domain/entities/analytics.entity");
class PrismaAnalyticsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(analytics) {
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
        return new analytics_entity_1.Analytics(createdAnalytics.id, createdAnalytics.urlId, createdAnalytics.totalClicks, createdAnalytics.uniqueVisitors, createdAnalytics.topReferrers, createdAnalytics.topUserAgents, createdAnalytics.clicksByDate, createdAnalytics.lastUpdated);
    }
    async findByUrlId(urlId) {
        const analytics = await this.prisma.analytics.findUnique({
            where: { urlId }
        });
        if (!analytics)
            return null;
        return new analytics_entity_1.Analytics(analytics.id, analytics.urlId, analytics.totalClicks, analytics.uniqueVisitors, analytics.topReferrers, analytics.topUserAgents, analytics.clicksByDate, analytics.lastUpdated);
    }
    async update(analytics) {
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
        return new analytics_entity_1.Analytics(updatedAnalytics.id, updatedAnalytics.urlId, updatedAnalytics.totalClicks, updatedAnalytics.uniqueVisitors, updatedAnalytics.topReferrers, updatedAnalytics.topUserAgents, updatedAnalytics.clicksByDate, updatedAnalytics.lastUpdated);
    }
    async delete(urlId) {
        await this.prisma.analytics.delete({
            where: { urlId }
        });
    }
    async updateFromClicks(urlId, clicks) {
        let analytics = await this.findByUrlId(urlId);
        if (!analytics) {
            analytics = analytics_entity_1.Analytics.create(urlId);
            analytics = await this.create(analytics);
        }
        const updatedAnalytics = analytics.updateFromClicks(clicks);
        return this.update(updatedAnalytics);
    }
}
exports.PrismaAnalyticsRepository = PrismaAnalyticsRepository;
//# sourceMappingURL=prisma-analytics.repository.js.map