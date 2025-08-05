"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserUrlsUseCase = void 0;
class GetUserUrlsUseCase {
    constructor(urlRepository) {
        this.urlRepository = urlRepository;
    }
    async execute(request) {
        const { userId, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = request;
        const urls = await this.urlRepository.findByUserId(userId, {
            page,
            limit,
            sortBy,
            sortOrder
        });
        const total = await this.urlRepository.countByUserId(userId);
        const totalPages = Math.ceil(total / limit);
        return {
            urls,
            total,
            page,
            limit,
            totalPages
        };
    }
}
exports.GetUserUrlsUseCase = GetUserUrlsUseCase;
//# sourceMappingURL=get-user-urls.use-case.js.map