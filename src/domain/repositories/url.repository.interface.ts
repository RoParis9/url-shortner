import { Url } from '../entities/url.entity';

export interface UrlRepository {
  create(url: Url): Promise<Url>;
  findById(id: string): Promise<Url | null>;
  findByShortCode(shortCode: string): Promise<Url | null>;
  findByUserId(userId: string, options?: {
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'clicks' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<Url[]>;
  update(url: Url): Promise<Url>;
  delete(id: string): Promise<void>;
  incrementClicks(id: string): Promise<void>;
  countByUserId(userId: string): Promise<number>;
} 