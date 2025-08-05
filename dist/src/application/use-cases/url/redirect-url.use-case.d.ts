import { Url } from '../../../domain/entities/url.entity';
import { UrlRepository } from '../../../domain/repositories/url.repository.interface';
import { ClickRepository } from '../../../domain/repositories/click.repository.interface';
export interface RedirectUrlRequest {
    shortCode: string;
    ipAddress?: string;
    userAgent?: string;
    referer?: string;
}
export interface RedirectUrlResponse {
    originalUrl: string;
    url: Url;
}
export declare class RedirectUrlUseCase {
    private urlRepository;
    private clickRepository;
    constructor(urlRepository: UrlRepository, clickRepository: ClickRepository);
    execute(request: RedirectUrlRequest): Promise<RedirectUrlResponse>;
}
//# sourceMappingURL=redirect-url.use-case.d.ts.map