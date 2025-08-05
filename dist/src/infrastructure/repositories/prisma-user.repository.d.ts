import { PrismaClient } from '@prisma/client';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
export declare class PrismaUserRepository implements UserRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    create(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=prisma-user.repository.d.ts.map