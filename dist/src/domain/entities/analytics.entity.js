"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analytics = void 0;
class Analytics {
    constructor(id, urlId, totalClicks, uniqueVisitors, topReferrers, topUserAgents, clicksByDate, lastUpdated) {
        this.id = id;
        this.urlId = urlId;
        this.totalClicks = totalClicks;
        this.uniqueVisitors = uniqueVisitors;
        this.topReferrers = topReferrers;
        this.topUserAgents = topUserAgents;
        this.clicksByDate = clicksByDate;
        this.lastUpdated = lastUpdated;
    }
    static create(urlId) {
        return new Analytics(this.generateId(), urlId, 0, 0, [], [], {}, new Date());
    }
    updateFromClicks(clicks) {
        const uniqueIPs = new Set(clicks.map(c => c.ipAddress).filter(Boolean));
        const referrers = clicks.map(c => c.referer).filter(Boolean);
        const userAgents = clicks.map(c => c.userAgent).filter(Boolean);
        return new Analytics(this.id, this.urlId, clicks.length, uniqueIPs.size, this.getTopItems(referrers), this.getTopItems(userAgents), this.aggregateByDate(clicks), new Date());
    }
    getTopItems(items) {
        const counts = items.reduce((acc, item) => {
            acc[item] = (acc[item] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([item]) => item);
    }
    aggregateByDate(clicks) {
        return clicks.reduce((acc, click) => {
            const date = click.timestamp.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
    }
    static generateId() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
}
exports.Analytics = Analytics;
//# sourceMappingURL=analytics.entity.js.map