"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUrlRepository = void 0;
const url_entity_1 = require("../../domain/entities/url.entity");
class PrismaUrlRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(url) {
        const createdUrl = await this.prisma.url.create({
            data: {
                id: url.id,
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                userId: url.userId,
                clicks: url.clicks,
                createdAt: url.createdAt,
                updatedAt: url.updatedAt
            }
        });
        return new url_entity_1.Url(createdUrl.id, createdUrl.originalUrl, createdUrl.shortCode, createdUrl.userId, createdUrl.clicks, createdUrl.createdAt, createdUrl.updatedAt);
    }
    async findById(id) {
        const url = await this.prisma.url.findUnique({
            where: { id }
        });
        if (!url)
            return null;
        return new url_entity_1.Url(url.id, url.originalUrl, url.shortCode, url.userId, url.clicks, url.createdAt, url.updatedAt);
    }
    async findByShortCode(shortCode) {
        const url = await this.prisma.url.findUnique({
            where: { shortCode }
        });
        if (!url)
            return null;
        return new url_entity_1.Url(url.id, url.originalUrl, url.shortCode, url.userId, url.clicks, url.createdAt, url.updatedAt);
    }
    async findByUserId(userId, options) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options || {};
        const skip = (page - 1) * limit;
        const urls = await this.prisma.url.findMany({
            where: { userId },
            orderBy: { [sortBy]: sortOrder },
            skip,
            take: limit
        });
        return urls.map(url => new url_entity_1.Url(url.id, url.originalUrl, url.shortCode, url.userId, url.clicks, url.createdAt, url.updatedAt));
    }
    async update(url) {
        const updatedUrl = await this.prisma.url.update({
            where: { id: url.id },
            data: {
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                userId: url.userId,
                clicks: url.clicks,
                updatedAt: url.updatedAt
            }
        });
        return new url_entity_1.Url(updatedUrl.id, updatedUrl.originalUrl, updatedUrl.shortCode, updatedUrl.userId, updatedUrl.clicks, updatedUrl.createdAt, updatedUrl.updatedAt);
    }
    async delete(id) {
        await this.prisma.url.delete({
            where: { id }
        });
    }
    async incrementClicks(id) {
        await this.prisma.url.update({
            where: { id },
            data: {
                clicks: {
                    increment: 1
                },
                updatedAt: new Date()
            }
        });
    }
    async countByUserId(userId) {
        return this.prisma.url.count({
            where: { userId }
        });
    }
}
exports.PrismaUrlRepository = PrismaUrlRepository;
//# sourceMappingURL=prisma-url.repository.js.map