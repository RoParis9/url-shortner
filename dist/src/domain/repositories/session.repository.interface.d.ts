import { Session } from '../entities/session.entity';
export interface SessionRepository {
    create(session: Session): Promise<Session>;
    findById(id: string): Promise<Session | null>;
    findByToken(token: string): Promise<Session | null>;
    findByUserId(userId: string): Promise<Session[]>;
    update(session: Session): Promise<Session>;
    delete(id: string): Promise<void>;
    deleteExpired(): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
}
//# sourceMappingURL=session.repository.interface.d.ts.map