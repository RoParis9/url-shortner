export class Click {
  constructor(
    public readonly id: string,
    public readonly urlId: string,
    public readonly ipAddress: string | null,
    public readonly userAgent: string | null,
    public readonly referer: string | null,
    public readonly timestamp: Date
  ) {}

  static create(
    urlId: string,
    ipAddress?: string,
    userAgent?: string,
    referer?: string
  ): Click {
    return new Click(
      this.generateId(),
      urlId,
      ipAddress || null,
      userAgent || null,
      referer || null,
      new Date()
    );
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public getClickData() {
    return {
      id: this.id,
      urlId: this.urlId,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      referer: this.referer,
      timestamp: this.timestamp
    };
  }
} 