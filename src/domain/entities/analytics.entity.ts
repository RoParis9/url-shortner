export class Analytics {
  constructor(
    public readonly id: string,
    public readonly urlId: string,
    public readonly totalClicks: number,
    public readonly uniqueVisitors: number,
    public readonly topReferrers: string[],
    public readonly topUserAgents: string[],
    public readonly clicksByDate: Record<string, number>,
    public readonly lastUpdated: Date
  ) {}

  static create(urlId: string): Analytics {
    return new Analytics(
      this.generateId(),
      urlId,
      0,
      0,
      [],
      [],
      {},
      new Date()
    );
  }

  updateFromClicks(clicks: any[]): Analytics {
    const uniqueIPs = new Set(clicks.map(c => c.ipAddress).filter(Boolean));
    const referrers = clicks.map(c => c.referer).filter(Boolean);
    const userAgents = clicks.map(c => c.userAgent).filter(Boolean);
    
    return new Analytics(
      this.id,
      this.urlId,
      clicks.length,
      uniqueIPs.size,
      this.getTopItems(referrers),
      this.getTopItems(userAgents),
      this.aggregateByDate(clicks),
      new Date()
    );
  }

  private getTopItems(items: string[]): string[] {
    const counts = items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([item]) => item);
  }

  private aggregateByDate(clicks: any[]): Record<string, number> {
    return clicks.reduce((acc, click) => {
      const date = click.timestamp.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
} 