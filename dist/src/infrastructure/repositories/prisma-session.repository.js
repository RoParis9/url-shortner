"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaSessionRepository = void 0;
const session_entity_1 = require("../../domain/entities/session.entity");
class PrismaSessionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(session) {
        const createdSession = await this.prisma.session.create({
            data: {
                id: session.id,
                userId: session.userId,
                token: session.token,
                expiresAt: session.expiresAt,
                createdAt: session.createdAt,
                ipAddress: session.ipAddress,
                userAgent: session.userAgent
            }
        });
        return new session_entity_1.Session(createdSession.id, createdSession.userId, createdSession.token, createdSession.expiresAt, createdSession.createdAt, createdSession.ipAddress, createdSession.userAgent);
    }
    async findById(id) {
        const session = await this.prisma.session.findUnique({
            where: { id }
        });
        if (!session)
            return null;
        return new session_entity_1.Session(session.id, session.userId, session.token, session.expiresAt, session.createdAt, session.ipAddress, session.userAgent);
    }
    async findByToken(token) {
        const session = await this.prisma.session.findUnique({
            where: { token }
        });
        if (!session)
            return null;
        return new session_entity_1.Session(session.id, session.userId, session.token, session.expiresAt, session.createdAt, session.ipAddress, session.userAgent);
    }
    async findByUserId(userId) {
        const sessions = await this.prisma.session.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        return sessions.map(session => new session_entity_1.Session(session.id, session.userId, session.token, session.expiresAt, session.createdAt, session.ipAddress, session.userAgent));
    }
    async update(session) {
        const updatedSession = await this.prisma.session.update({
            where: { id: session.id },
            data: {
                token: session.token,
                expiresAt: session.expiresAt,
                ipAddress: session.ipAddress,
                userAgent: session.userAgent
            }
        });
        return new session_entity_1.Session(updatedSession.id, updatedSession.userId, updatedSession.token, updatedSession.expiresAt, updatedSession.createdAt, updatedSession.ipAddress, updatedSession.userAgent);
    }
    async delete(id) {
        await this.prisma.session.delete({
            where: { id }
        });
    }
    async deleteByUserId(userId) {
        await this.prisma.session.deleteMany({
            where: { userId }
        });
    }
    async deleteExpired() {
        await this.prisma.session.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
    }
}
exports.PrismaSessionRepository = PrismaSessionRepository;
//# sourceMappingURL=prisma-session.repository.js.map