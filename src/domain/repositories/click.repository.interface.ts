import { Click } from '../entities/click.entity';

export interface ClickRepository {
  create(click: Click): Promise<Click>;
  findByUrlId(urlId: string, options?: {
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'day' | 'hour' | 'month';
  }): Promise<Click[]>;
  getClickCountByUrlId(urlId: string): Promise<number>;
} 