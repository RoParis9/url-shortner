"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectUrlUseCase = void 0;
const click_entity_1 = require("../../../domain/entities/click.entity");
class RedirectUrlUseCase {
    constructor(urlRepository, clickRepository) {
        this.urlRepository = urlRepository;
        this.clickRepository = clickRepository;
    }
    async execute(request) {
        const { shortCode, ipAddress, userAgent, referer } = request;
        const url = await this.urlRepository.findByShortCode(shortCode);
        if (!url) {
            throw new Error('URL not found');
        }
        const click = click_entity_1.Click.create(url.id, ipAddress, userAgent, referer);
        await this.clickRepository.create(click);
        const updatedUrl = url.incrementClicks();
        await this.urlRepository.update(updatedUrl);
        return {
            originalUrl: updatedUrl.originalUrl,
            url: updatedUrl
        };
    }
}
exports.RedirectUrlUseCase = RedirectUrlUseCase;
//# sourceMappingURL=redirect-url.use-case.js.map