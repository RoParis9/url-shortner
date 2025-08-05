"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Url = void 0;
class Url {
    constructor(id, originalUrl, shortCode, userId, clicks, createdAt, updatedAt) {
        this.id = id;
        this.originalUrl = originalUrl;
        this.shortCode = shortCode;
        this.userId = userId;
        this.clicks = clicks;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(originalUrl, userId) {
        if (!this.isValidUrl(originalUrl)) {
            throw new Error('Invalid URL format');
        }
        return new Url(this.generateId(), this.normalizeUrl(originalUrl), this.generateShortCode(), userId || null, 0, new Date(), new Date());
    }
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch {
            return false;
        }
    }
    static normalizeUrl(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    }
    static generateShortCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    static generateId() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    incrementClicks() {
        return new Url(this.id, this.originalUrl, this.shortCode, this.userId, this.clicks + 1, this.createdAt, new Date());
    }
    updateOriginalUrl(newUrl) {
        if (!Url.isValidUrl(newUrl)) {
            throw new Error('Invalid URL format');
        }
        return new Url(this.id, Url.normalizeUrl(newUrl), this.shortCode, this.userId, this.clicks, this.createdAt, new Date());
    }
    getFullShortUrl(baseUrl) {
        return `${baseUrl}/${this.shortCode}`;
    }
}
exports.Url = Url;
//# sourceMappingURL=url.entity.js.map