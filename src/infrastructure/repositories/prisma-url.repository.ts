import { PrismaClient } from '@prisma/client';
import { Url } from '../../domain/entities/url.entity';
import { UrlRepository } from '../../domain/repositories/url.repository.interface';

export class PrismaUrlRepository implements UrlRepository {
  constructor(private prisma: PrismaClient) {}

  async create(url: Url): Promise<Url> {
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

    return new Url(
      createdUrl.id,
      createdUrl.originalUrl,
      createdUrl.shortCode,
      createdUrl.userId,
      createdUrl.clicks,
      createdUrl.createdAt,
      createdUrl.updatedAt
    );
  }

  async findById(id: string): Promise<Url | null> {
    const url = await this.prisma.url.findUnique({
      where: { id }
    });

    if (!url) return null;

    return new Url(
      url.id,
      url.originalUrl,
      url.shortCode,
      url.userId,
      url.clicks,
      url.createdAt,
      url.updatedAt
    );
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    const url = await this.prisma.url.findUnique({
      where: { shortCode }
    });

    if (!url) return null;

    return new Url(
      url.id,
      url.originalUrl,
      url.shortCode,
      url.userId,
      url.clicks,
      url.createdAt,
      url.updatedAt
    );
  }

  async findByUserId(userId: string, options?: {
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'clicks' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<Url[]> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options || {};
    const skip = (page - 1) * limit;

    const urls = await this.prisma.url.findMany({
      where: { userId },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit
    });

    return urls.map(url => new Url(
      url.id,
      url.originalUrl,
      url.shortCode,
      url.userId,
      url.clicks,
      url.createdAt,
      url.updatedAt
    ));
  }

  async update(url: Url): Promise<Url> {
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

    return new Url(
      updatedUrl.id,
      updatedUrl.originalUrl,
      updatedUrl.shortCode,
      updatedUrl.userId,
      updatedUrl.clicks,
      updatedUrl.createdAt,
      updatedUrl.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.url.delete({
      where: { id }
    });
  }

  async incrementClicks(id: string): Promise<void> {
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

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.url.count({
      where: { userId }
    });
  }
} 