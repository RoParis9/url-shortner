import { Url } from '../../../domain/entities/url.entity';
import { UrlRepository } from '../../../domain/repositories/url.repository.interface';
export interface BulkUrlRequest {
    originalUrl: string;
    customShortCode?: string;
}
export interface BulkCreateUrlsRequest {
    urls: BulkUrlRequest[];
    userId?: string;
}
export interface BulkCreateUrlsResponse {
    urls: Url[];
    shortUrls: string[];
    failedUrls: Array<{
        url: string;
        error: string;
    }>;
    message: string;
}
export declare class BulkCreateUrlsUseCase {
    private urlRepository;
    private baseUrl;
    constructor(urlRepository: UrlRepository, baseUrl: string);
    execute(request: BulkCreateUrlsRequest): Promise<BulkCreateUrlsResponse>;
}
//# sourceMappingURL=bulk-create-urls.use-case.d.ts.map