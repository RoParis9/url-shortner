import { Url } from '../../../domain/entities/url.entity';
import { UrlRepository } from '../../../domain/repositories/url.repository.interface';
export interface CreateUrlRequest {
    originalUrl: string;
    userId?: string;
    customShortCode?: string;
}
export interface CreateUrlResponse {
    url: Url;
    shortUrl: string;
}
export declare class CreateUrlUseCase {
    private urlRepository;
    private baseUrl;
    constructor(urlRepository: UrlRepository, baseUrl: string);
    execute(request: CreateUrlRequest): Promise<CreateUrlResponse>;
}
//# sourceMappingURL=create-url.use-case.d.ts.map