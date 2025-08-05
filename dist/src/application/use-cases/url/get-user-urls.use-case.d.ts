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
export declare class GetUserUrlsUseCase {
    private urlRepository;
    constructor(urlRepository: UrlRepository);
    execute(request: GetUserUrlsRequest): Promise<GetUserUrlsResponse>;
}
//# sourceMappingURL=get-user-urls.use-case.d.ts.map