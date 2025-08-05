import { PrismaClient } from '@prisma/client';
import { Click } from '../../domain/entities/click.entity';
import { ClickRepository } from '../../domain/repositories/click.repository.interface';
export declare class PrismaClickRepository implements ClickRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    create(click: Click): Promise<Click>;
    findById(id: string): Promise<Click | null>;
    findByUrlId(urlId: string): Promise<Click[]>;
    delete(id: string): Promise<void>;
    deleteByUrlId(urlId: string): Promise<void>;
    getClickCountByUrlId(urlId: string): Promise<number>;
}
//# sourceMappingURL=prisma-click.repository.d.ts.map