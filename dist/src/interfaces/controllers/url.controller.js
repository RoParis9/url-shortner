"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlController = void 0;
class UrlController {
    constructor(createUrlUseCase, getUserUrlsUseCase, updateUrlUseCase, deleteUrlUseCase, redirectUrlUseCase, bulkCreateUrlsUseCase) {
        this.createUrlUseCase = createUrlUseCase;
        this.getUserUrlsUseCase = getUserUrlsUseCase;
        this.updateUrlUseCase = updateUrlUseCase;
        this.deleteUrlUseCase = deleteUrlUseCase;
        this.redirectUrlUseCase = redirectUrlUseCase;
        this.bulkCreateUrlsUseCase = bulkCreateUrlsUseCase;
        this.createUrl = async (req, res) => {
            try {
                const { originalUrl, customShortCode } = req.body;
                const userId = req.user?.userId;
                if (!originalUrl) {
                    res.status(400).json({ error: 'Original URL is required' });
                    return;
                }
                const result = await this.createUrlUseCase.execute({
                    originalUrl,
                    userId,
                    customShortCode
                });
                res.status(201).json({
                    message: 'URL shortened successfully',
                    url: {
                        id: result.url.id,
                        originalUrl: result.url.originalUrl,
                        shortCode: result.url.shortCode,
                        shortUrl: result.shortUrl,
                        clicks: result.url.clicks,
                        createdAt: result.url.createdAt
                    }
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        };
        this.getUserUrls = async (req, res) => {
            try {
                const userId = req.user?.userId;
                const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
                if (!userId) {
                    res.status(401).json({ error: 'Authentication required' });
                    return;
                }
                const result = await this.getUserUrlsUseCase.execute({
                    userId,
                    page: Number(page),
                    limit: Number(limit),
                    sortBy: sortBy,
                    sortOrder: sortOrder
                });
                res.status(200).json({
                    message: 'URLs retrieved successfully',
                    urls: result.urls.map(url => ({
                        id: url.id,
                        originalUrl: url.originalUrl,
                        shortCode: url.shortCode,
                        shortUrl: url.getFullShortUrl(req.get('host') || 'localhost:3000'),
                        clicks: url.clicks,
                        createdAt: url.createdAt,
                        updatedAt: url.updatedAt
                    })),
                    pagination: {
                        total: result.total,
                        page: result.page,
                        limit: result.limit,
                        totalPages: result.totalPages
                    }
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        };
        this.updateUrl = async (req, res) => {
            try {
                const { urlId } = req.params;
                const { originalUrl, customShortCode } = req.body;
                const userId = req.user?.userId;
                if (!userId) {
                    res.status(401).json({ error: 'Authentication required' });
                    return;
                }
                const result = await this.updateUrlUseCase.execute({
                    urlId,
                    userId,
                    originalUrl,
                    customShortCode
                });
                res.status(200).json({
                    message: result.message,
                    url: {
                        id: result.url.id,
                        originalUrl: result.url.originalUrl,
                        shortCode: result.url.shortCode,
                        shortUrl: result.url.getFullShortUrl(req.get('host') || 'localhost:3000'),
                        clicks: result.url.clicks,
                        createdAt: result.url.createdAt,
                        updatedAt: result.url.updatedAt
                    }
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        };
        this.deleteUrl = async (req, res) => {
            try {
                const { urlId } = req.params;
                const userId = req.user?.userId;
                if (!userId) {
                    res.status(401).json({ error: 'Authentication required' });
                    return;
                }
                const result = await this.deleteUrlUseCase.execute({
                    urlId,
                    userId
                });
                res.status(200).json({
                    message: result.message
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        };
        this.redirect = async (req, res) => {
            try {
                const { shortCode } = req.params;
                if (!shortCode) {
                    res.status(400).json({ error: 'Short code is required' });
                    return;
                }
                const result = await this.redirectUrlUseCase.execute({
                    shortCode,
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent'),
                    referer: req.get('Referer')
                });
                res.redirect(result.originalUrl);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'URL not found') {
                    res.status(404).json({ error: 'URL not found' });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        };
        this.createPublicUrl = async (req, res) => {
            try {
                const { originalUrl, customShortCode } = req.body;
                if (!originalUrl) {
                    res.status(400).json({ error: 'Original URL is required' });
                    return;
                }
                const result = await this.createUrlUseCase.execute({
                    originalUrl,
                    customShortCode
                });
                res.status(201).json({
                    message: 'URL shortened successfully',
                    url: {
                        id: result.url.id,
                        originalUrl: result.url.originalUrl,
                        shortCode: result.url.shortCode,
                        shortUrl: result.shortUrl,
                        clicks: result.url.clicks,
                        createdAt: result.url.createdAt
                    }
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        };
        this.bulkCreateUrls = async (req, res) => {
            try {
                const { urls } = req.body;
                const userId = req.user?.userId;
                if (!urls || !Array.isArray(urls)) {
                    res.status(400).json({ error: 'URLs array is required' });
                    return;
                }
                const result = await this.bulkCreateUrlsUseCase.execute({
                    urls,
                    userId
                });
                res.status(201).json({
                    message: result.message,
                    urls: result.urls.map(url => ({
                        id: url.id,
                        originalUrl: url.originalUrl,
                        shortCode: url.shortCode,
                        shortUrl: url.getFullShortUrl(req.get('host') || 'localhost:3000'),
                        clicks: url.clicks,
                        createdAt: url.createdAt
                    })),
                    shortUrls: result.shortUrls,
                    failedUrls: result.failedUrls
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        };
    }
}
exports.UrlController = UrlController;
//# sourceMappingURL=url.controller.js.map