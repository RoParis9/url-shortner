export class Url {
  constructor(
    public readonly id: string,
    public readonly originalUrl: string,
    public readonly shortCode: string,
    public readonly userId: string | null,
    public readonly clicks: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(originalUrl: string, userId?: string): Url {
    if (!this.isValidUrl(originalUrl)) {
      throw new Error('Invalid URL format');
    }

    return new Url(
      this.generateId(),
      this.normalizeUrl(originalUrl),
      this.generateShortCode(),
      userId || null,
      0,
      new Date(),
      new Date()
    );
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private static normalizeUrl(url: string): string {
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }

  private static generateShortCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public incrementClicks(): Url {
    return new Url(
      this.id,
      this.originalUrl,
      this.shortCode,
      this.userId,
      this.clicks + 1,
      this.createdAt,
      new Date()
    );
  }

  public updateOriginalUrl(newUrl: string): Url {
    if (!Url.isValidUrl(newUrl)) {
      throw new Error('Invalid URL format');
    }

    return new Url(
      this.id,
      Url.normalizeUrl(newUrl),
      this.shortCode,
      this.userId,
      this.clicks,
      this.createdAt,
      new Date()
    );
  }

  public getFullShortUrl(baseUrl: string): string {
    return `${baseUrl}/${this.shortCode}`;
  }
} 