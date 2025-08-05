export class Session {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public readonly ipAddress: string | null,
    public readonly userAgent: string | null
  ) {}

  static create(
    userId: string,
    token: string,
    expiresAt: Date,
    ipAddress?: string,
    userAgent?: string
  ): Session {
    return new Session(
      this.generateId(),
      userId,
      token,
      expiresAt,
      new Date(),
      ipAddress || null,
      userAgent || null
    );
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  updateToken(newToken: string): Session {
    return new Session(
      this.id,
      this.userId,
      newToken,
      this.expiresAt,
      this.createdAt,
      this.ipAddress,
      this.userAgent
    );
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
} 