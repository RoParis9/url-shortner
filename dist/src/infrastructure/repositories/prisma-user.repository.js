"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const user_entity_1 = require("../../domain/entities/user.entity");
class PrismaUserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(user) {
        const createdUser = await this.prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                password: user.password,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
        return new user_entity_1.User(createdUser.id, createdUser.email, createdUser.password, createdUser.createdAt, createdUser.updatedAt);
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        if (!user)
            return null;
        return new user_entity_1.User(user.id, user.email, user.password, user.createdAt, user.updatedAt);
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() }
        });
        if (!user)
            return null;
        return new user_entity_1.User(user.id, user.email, user.password, user.createdAt, user.updatedAt);
    }
    async update(user) {
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                email: user.email,
                password: user.password,
                updatedAt: user.updatedAt
            }
        });
        return new user_entity_1.User(updatedUser.id, updatedUser.email, updatedUser.password, updatedUser.createdAt, updatedUser.updatedAt);
    }
    async delete(id) {
        await this.prisma.user.delete({
            where: { id }
        });
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
//# sourceMappingURL=prisma-user.repository.js.map