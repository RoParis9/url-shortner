import { Url } from '../../../domain/entities/url.entity';
import { UrlRepository } from '../../../domain/repositories/url.repository.interface';

export interface GetUserUrlsRequest {
  userId: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'clicks' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface GetUserUrlsResponse {
  urls: Url[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetUserUrlsUseCase {
  constructor(private urlRepository: UrlRepository) {}

  async execute(request: GetUserUrlsRequest): Promise<GetUserUrlsResponse> {
    const { userId, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = request;

    const urls = await this.urlRepository.findByUserId(userId, {
      page,
      limit,
      sortBy,
      sortOrder
    });

    const total = await this.urlRepository.countByUserId(userId);
    const totalPages = Math.ceil(total / limit);

    return {
      urls,
      total,
      page,
      limit,
      totalPages
    };
  }
} 