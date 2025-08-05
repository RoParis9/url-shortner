export declare class Analytics {
    readonly id: string;
    readonly urlId: string;
    readonly totalClicks: number;
    readonly uniqueVisitors: number;
    readonly topReferrers: string[];
    readonly topUserAgents: string[];
    readonly clicksByDate: Record<string, number>;
    readonly lastUpdated: Date;
    constructor(id: string, urlId: string, totalClicks: number, uniqueVisitors: number, topReferrers: string[], topUserAgents: string[], clicksByDate: Record<string, number>, lastUpdated: Date);
    static create(urlId: string): Analytics;
    updateFromClicks(clicks: any[]): Analytics;
    private getTopItems;
    private aggregateByDate;
    private static generateId;
}
//# sourceMappingURL=analytics.entity.d.ts.map