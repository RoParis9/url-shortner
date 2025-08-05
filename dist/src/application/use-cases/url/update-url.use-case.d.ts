import { Url } from '../../../domain/entities/url.entity';
import { UrlRepository } from '../../../domain/repositories/url.repository.interface';
export interface UpdateUrlRequest {
    urlId: string;
    userId: string;
    originalUrl?: string;
    customShortCode?: string;
}
export interface UpdateUrlResponse {
    url: Url;
    message: string;
}
export declare class UpdateUrlUseCase {
    private urlRepository;
    constructor(urlRepository: UrlRepository);
    execute(request: UpdateUrlRequest): Promise<UpdateUrlResponse>;
}
//# sourceMappingURL=update-url.use-case.d.ts.map