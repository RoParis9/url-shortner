export declare class Click {
    readonly id: string;
    readonly urlId: string;
    readonly ipAddress: string | null;
    readonly userAgent: string | null;
    readonly referer: string | null;
    readonly timestamp: Date;
    constructor(id: string, urlId: string, ipAddress: string | null, userAgent: string | null, referer: string | null, timestamp: Date);
    static create(urlId: string, ipAddress?: string, userAgent?: string, referer?: string): Click;
    private static generateId;
    getClickData(): {
        id: string;
        urlId: string;
        ipAddress: string | null;
        userAgent: string | null;
        referer: string | null;
        timestamp: Date;
    };
}
//# sourceMappingURL=click.entity.d.ts.map