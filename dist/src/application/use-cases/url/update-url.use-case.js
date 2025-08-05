"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUrlUseCase = void 0;
const url_entity_1 = require("../../../domain/entities/url.entity");
class UpdateUrlUseCase {
    constructor(urlRepository) {
        this.urlRepository = urlRepository;
    }
    async execute(request) {
        const { urlId, userId, originalUrl, customShortCode } = request;
        const existingUrl = await this.urlRepository.findById(urlId);
        if (!existingUrl) {
            throw new Error('URL not found');
        }
        if (existingUrl.userId !== userId) {
            throw new Error('Unauthorized to update this URL');
        }
        if (customShortCode && customShortCode !== existingUrl.shortCode) {
            const urlWithSameCode = await this.urlRepository.findByShortCode(customShortCode);
            if (urlWithSameCode) {
                throw new Error('Custom short code is already taken');
            }
        }
        let updatedUrl = existingUrl;
        if (originalUrl) {
            updatedUrl = updatedUrl.updateOriginalUrl(originalUrl);
        }
        if (customShortCode && customShortCode !== existingUrl.shortCode) {
            updatedUrl = new url_entity_1.Url(updatedUrl.id, updatedUrl.originalUrl, customShortCode, updatedUrl.userId, updatedUrl.clicks, updatedUrl.createdAt, new Date());
        }
        const savedUrl = await this.urlRepository.update(updatedUrl);
        return {
            url: savedUrl,
            message: 'URL updated successfully'
        };
    }
}
exports.UpdateUrlUseCase = UpdateUrlUseCase;
//# sourceMappingURL=update-url.use-case.js.map