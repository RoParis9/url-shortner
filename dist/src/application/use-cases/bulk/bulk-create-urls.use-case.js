"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkCreateUrlsUseCase = void 0;
const url_entity_1 = require("../../../domain/entities/url.entity");
class BulkCreateUrlsUseCase {
    constructor(urlRepository, baseUrl) {
        this.urlRepository = urlRepository;
        this.baseUrl = baseUrl;
    }
    async execute(request) {
        const { urls, userId } = request;
        if (urls.length === 0) {
            throw new Error('No URLs provided');
        }
        if (urls.length > 100) {
            throw new Error('Maximum 100 URLs allowed per bulk operation');
        }
        const createdUrls = [];
        const shortUrls = [];
        const failedUrls = [];
        const results = await Promise.allSettled(urls.map(async (urlRequest) => {
            try {
                if (urlRequest.customShortCode) {
                    const existingUrl = await this.urlRepository.findByShortCode(urlRequest.customShortCode);
                    if (existingUrl) {
                        throw new Error(`Custom short code '${urlRequest.customShortCode}' is already taken`);
                    }
                }
                const url = url_entity_1.Url.create(urlRequest.originalUrl, userId);
                let finalUrl = url;
                if (urlRequest.customShortCode) {
                    finalUrl = new url_entity_1.Url(url.id, url.originalUrl, urlRequest.customShortCode, url.userId, url.clicks, url.createdAt, url.updatedAt);
                }
                const savedUrl = await this.urlRepository.create(finalUrl);
                return savedUrl;
            }
            catch (error) {
                throw new Error(`Failed to create URL '${urlRequest.originalUrl}': ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }));
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                const url = result.value;
                createdUrls.push(url);
                shortUrls.push(url.getFullShortUrl(this.baseUrl));
            }
            else {
                failedUrls.push({
                    url: urls[index].originalUrl,
                    error: result.reason.message
                });
            }
        });
        return {
            urls: createdUrls,
            shortUrls,
            failedUrls,
            message: `Successfully created ${createdUrls.length} URLs${failedUrls.length > 0 ? `, ${failedUrls.length} failed` : ''}`
        };
    }
}
exports.BulkCreateUrlsUseCase = BulkCreateUrlsUseCase;
//# sourceMappingURL=bulk-create-urls.use-case.js.map