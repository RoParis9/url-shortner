export declare class Session {
    readonly id: string;
    readonly userId: string;
    readonly token: string;
    readonly expiresAt: Date;
    readonly createdAt: Date;
    readonly ipAddress: string | null;
    readonly userAgent: string | null;
    constructor(id: string, userId: string, token: string, expiresAt: Date, createdAt: Date, ipAddress: string | null, userAgent: string | null);
    static create(userId: string, token: string, expiresAt: Date, ipAddress?: string, userAgent?: string): Session;
    isExpired(): boolean;
    updateToken(newToken: string): Session;
    private static generateId;
}
//# sourceMappingURL=session.entity.d.ts.map