import { UrlRepository } from '../../../domain/repositories/url.repository.interface';
export interface DeleteUrlRequest {
    urlId: string;
    userId: string;
}
export interface DeleteUrlResponse {
    message: string;
}
export declare class DeleteUrlUseCase {
    private urlRepository;
    constructor(urlRepository: UrlRepository);
    execute(request: DeleteUrlRequest): Promise<DeleteUrlResponse>;
}
//# sourceMappingURL=delete-url.use-case.d.ts.map