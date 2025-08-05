"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClickRepository = void 0;
const click_entity_1 = require("../../domain/entities/click.entity");
class PrismaClickRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(click) {
        const createdClick = await this.prisma.click.create({
            data: {
                id: click.id,
                urlId: click.urlId,
                ipAddress: click.ipAddress,
                userAgent: click.userAgent,
                referer: click.referer,
                timestamp: click.timestamp
            }
        });
        return new click_entity_1.Click(createdClick.id, createdClick.urlId, createdClick.ipAddress, createdClick.userAgent, createdClick.referer, createdClick.timestamp);
    }
    async findById(id) {
        const click = await this.prisma.click.findUnique({
            where: { id }
        });
        if (!click)
            return null;
        return new click_entity_1.Click(click.id, click.urlId, click.ipAddress, click.userAgent, click.referer, click.timestamp);
    }
    async findByUrlId(urlId) {
        const clicks = await this.prisma.click.findMany({
            where: { urlId },
            orderBy: { timestamp: 'desc' }
        });
        return clicks.map(click => new click_entity_1.Click(click.id, click.urlId, click.ipAddress, click.userAgent, click.referer, click.timestamp));
    }
    async delete(id) {
        await this.prisma.click.delete({
            where: { id }
        });
    }
    async deleteByUrlId(urlId) {
        await this.prisma.click.deleteMany({
            where: { urlId }
        });
    }
    async getClickCountByUrlId(urlId) {
        return this.prisma.click.count({
            where: { urlId }
        });
    }
}
exports.PrismaClickRepository = PrismaClickRepository;
//# sourceMappingURL=prisma-click.repository.js.map