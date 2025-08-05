"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUrlUseCase = void 0;
const url_entity_1 = require("../../../domain/entities/url.entity");
class CreateUrlUseCase {
    constructor(urlRepository, baseUrl) {
        this.urlRepository = urlRepository;
        this.baseUrl = baseUrl;
    }
    async execute(request) {
        const { originalUrl, userId, customShortCode } = request;
        if (customShortCode) {
            const existingUrl = await this.urlRepository.findByShortCode(customShortCode);
            if (existingUrl) {
                throw new Error('Custom short code is already taken');
            }
        }
        const url = url_entity_1.Url.create(originalUrl, userId);
        let finalUrl = url;
        if (customShortCode) {
            finalUrl = new url_entity_1.Url(url.id, url.originalUrl, customShortCode, url.userId, url.clicks, url.createdAt, url.updatedAt);
        }
        let attempts = 0;
        let savedUrl = finalUrl;
        while (attempts < 5) {
            try {
                savedUrl = await this.urlRepository.create(finalUrl);
                break;
            }
            catch (error) {
                if (error instanceof Error && error.message.includes('unique constraint')) {
                    finalUrl = url_entity_1.Url.create(originalUrl, userId);
                    attempts++;
                }
                else {
                    throw error;
                }
            }
        }
        if (attempts >= 5) {
            throw new Error('Unable to generate unique short code');
        }
        return {
            url: savedUrl,
            shortUrl: savedUrl.getFullShortUrl(this.baseUrl)
        };
    }
}
exports.CreateUrlUseCase = CreateUrlUseCase;
//# sourceMappingURL=create-url.use-case.js.map