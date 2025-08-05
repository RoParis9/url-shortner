import { PrismaClient } from '@prisma/client';
import { Url } from '../../domain/entities/url.entity';
import { UrlRepository } from '../../domain/repositories/url.repository.interface';
export declare class PrismaUrlRepository implements UrlRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    create(url: Url): Promise<Url>;
    findById(id: string): Promise<Url | null>;
    findByShortCode(shortCode: string): Promise<Url | null>;
    findByUserId(userId: string, options?: {
        page?: number;
        limit?: number;
        sortBy?: 'createdAt' | 'clicks' | 'updatedAt';
        sortOrder?: 'asc' | 'desc';
    }): Promise<Url[]>;
    update(url: Url): Promise<Url>;
    delete(id: string): Promise<void>;
    incrementClicks(id: string): Promise<void>;
    countByUserId(userId: string): Promise<number>;
}
//# sourceMappingURL=prisma-url.repository.d.ts.map