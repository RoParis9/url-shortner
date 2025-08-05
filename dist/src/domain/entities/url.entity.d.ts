export declare class Url {
    readonly id: string;
    readonly originalUrl: string;
    readonly shortCode: string;
    readonly userId: string | null;
    readonly clicks: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, originalUrl: string, shortCode: string, userId: string | null, clicks: number, createdAt: Date, updatedAt: Date);
    static create(originalUrl: string, userId?: string): Url;
    private static isValidUrl;
    private static normalizeUrl;
    private static generateShortCode;
    private static generateId;
    incrementClicks(): Url;
    updateOriginalUrl(newUrl: string): Url;
    getFullShortUrl(baseUrl: string): string;
}
//# sourceMappingURL=url.entity.d.ts.map