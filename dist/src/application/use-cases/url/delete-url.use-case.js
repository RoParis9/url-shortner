"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUrlUseCase = void 0;
class DeleteUrlUseCase {
    constructor(urlRepository) {
        this.urlRepository = urlRepository;
    }
    async execute(request) {
        const { urlId, userId } = request;
        const existingUrl = await this.urlRepository.findById(urlId);
        if (!existingUrl) {
            throw new Error('URL not found');
        }
        if (existingUrl.userId !== userId) {
            throw new Error('Unauthorized to delete this URL');
        }
        await this.urlRepository.delete(urlId);
        return {
            message: 'URL deleted successfully'
        };
    }
}
exports.DeleteUrlUseCase = DeleteUrlUseCase;
//# sourceMappingURL=delete-url.use-case.js.map