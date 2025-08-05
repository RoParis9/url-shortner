"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_entity_1 = require("@/domain/entities/url.entity");
describe('Url Entity', () => {
    describe('create', () => {
        it('should create a URL with valid original URL', () => {
            const originalUrl = 'https://example.com';
            const userId = 'user123';
            const url = url_entity_1.Url.create(originalUrl, userId);
            expect(url.originalUrl).toBe(originalUrl);
            expect(url.shortCode).toBeDefined();
            expect(url.shortCode.length).toBe(6);
            expect(url.userId).toBe(userId);
            expect(url.clicks).toBe(0);
            expect(url.id).toBeDefined();
            expect(url.createdAt).toBeInstanceOf(Date);
            expect(url.updatedAt).toBeInstanceOf(Date);
        });
        it('should create a URL without user ID', () => {
            const originalUrl = 'https://example.com';
            const url = url_entity_1.Url.create(originalUrl);
            expect(url.userId).toBeNull();
        });
        it('should throw error for invalid URL', () => {
            const invalidUrl = 'not-a-url';
            expect(() => url_entity_1.Url.create(invalidUrl)).toThrow('Invalid URL format');
        });
        it('should normalize URL without protocol', () => {
            const urlWithoutProtocol = 'example.com';
            const url = url_entity_1.Url.create(urlWithoutProtocol);
            expect(url.originalUrl).toBe('https://example.com');
        });
        it('should keep URL with existing protocol', () => {
            const urlWithProtocol = 'http://example.com';
            const url = url_entity_1.Url.create(urlWithProtocol);
            expect(url.originalUrl).toBe('http://example.com');
        });
    });
    describe('incrementClicks', () => {
        it('should increment click count', () => {
            const url = url_entity_1.Url.create('https://example.com');
            const initialClicks = url.clicks;
            const updatedUrl = url.incrementClicks();
            expect(updatedUrl.clicks).toBe(initialClicks + 1);
            expect(updatedUrl.id).toBe(url.id);
            expect(updatedUrl.originalUrl).toBe(url.originalUrl);
            expect(updatedUrl.shortCode).toBe(url.shortCode);
            expect(updatedUrl.userId).toBe(url.userId);
            expect(updatedUrl.createdAt).toEqual(url.createdAt);
            expect(updatedUrl.updatedAt.getTime()).toBeGreaterThan(url.updatedAt.getTime());
        });
    });
    describe('updateOriginalUrl', () => {
        it('should update original URL with valid format', () => {
            const url = url_entity_1.Url.create('https://old.com');
            const newUrl = 'https://new.com';
            const updatedUrl = url.updateOriginalUrl(newUrl);
            expect(updatedUrl.originalUrl).toBe(newUrl);
            expect(updatedUrl.id).toBe(url.id);
            expect(updatedUrl.shortCode).toBe(url.shortCode);
            expect(updatedUrl.userId).toBe(url.userId);
            expect(updatedUrl.clicks).toBe(url.clicks);
            expect(updatedUrl.createdAt).toEqual(url.createdAt);
            expect(updatedUrl.updatedAt.getTime()).toBeGreaterThan(url.updatedAt.getTime());
        });
        it('should throw error for invalid URL format', () => {
            const url = url_entity_1.Url.create('https://example.com');
            const invalidUrl = 'not-a-url';
            expect(() => url.updateOriginalUrl(invalidUrl)).toThrow('Invalid URL format');
        });
        it('should normalize URL without protocol', () => {
            const url = url_entity_1.Url.create('https://old.com');
            const newUrl = 'new.com';
            const updatedUrl = url.updateOriginalUrl(newUrl);
            expect(updatedUrl.originalUrl).toBe('https://new.com');
        });
    });
    describe('getFullShortUrl', () => {
        it('should return full short URL with base URL', () => {
            const url = url_entity_1.Url.create('https://example.com');
            const baseUrl = 'https://short.ly';
            const fullShortUrl = url.getFullShortUrl(baseUrl);
            expect(fullShortUrl).toBe(`${baseUrl}/${url.shortCode}`);
        });
    });
});
//# sourceMappingURL=url.entity.test.js.map