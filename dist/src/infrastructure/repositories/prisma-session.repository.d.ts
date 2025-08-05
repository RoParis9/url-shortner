import { PrismaClient } from '@prisma/client';
import { Session } from '../../domain/entities/session.entity';
import { SessionRepository } from '../../domain/repositories/session.repository.interface';
export declare class PrismaSessionRepository implements SessionRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    create(session: Session): Promise<Session>;
    findById(id: string): Promise<Session | null>;
    findByToken(token: string): Promise<Session | null>;
    findByUserId(userId: string): Promise<Session[]>;
    update(session: Session): Promise<Session>;
    delete(id: string): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
    deleteExpired(): Promise<void>;
}
//# sourceMappingURL=prisma-session.repository.d.ts.map