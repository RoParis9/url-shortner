import { PrismaClient } from '@prisma/client';
import { Click } from '../../domain/entities/click.entity';
import { ClickRepository } from '../../domain/repositories/click.repository.interface';

export class PrismaClickRepository implements ClickRepository {
  constructor(private prisma: PrismaClient) {}

  async create(click: Click): Promise<Click> {
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

    return new Click(
      createdClick.id,
      createdClick.urlId,
      createdClick.ipAddress,
      createdClick.userAgent,
      createdClick.referer,
      createdClick.timestamp
    );
  }

  async findById(id: string): Promise<Click | null> {
    const click = await this.prisma.click.findUnique({
      where: { id }
    });

    if (!click) return null;

    return new Click(
      click.id,
      click.urlId,
      click.ipAddress,
      click.userAgent,
      click.referer,
      click.timestamp
    );
  }

  async findByUrlId(urlId: string): Promise<Click[]> {
    const clicks = await this.prisma.click.findMany({
      where: { urlId },
      orderBy: { timestamp: 'desc' }
    });

    return clicks.map(click => new Click(
      click.id,
      click.urlId,
      click.ipAddress,
      click.userAgent,
      click.referer,
      click.timestamp
    ));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.click.delete({
      where: { id }
    });
  }

  async deleteByUrlId(urlId: string): Promise<void> {
    await this.prisma.click.deleteMany({
      where: { urlId }
    });
  }

  async getClickCountByUrlId(urlId: string): Promise<number> {
    return this.prisma.click.count({
      where: { urlId }
    });
  }
} 