"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Click = void 0;
class Click {
    constructor(id, urlId, ipAddress, userAgent, referer, timestamp) {
        this.id = id;
        this.urlId = urlId;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.referer = referer;
        this.timestamp = timestamp;
    }
    static create(urlId, ipAddress, userAgent, referer) {
        return new Click(this.generateId(), urlId, ipAddress || null, userAgent || null, referer || null, new Date());
    }
    static generateId() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    getClickData() {
        return {
            id: this.id,
            urlId: this.urlId,
            ipAddress: this.ipAddress,
            userAgent: this.userAgent,
            referer: this.referer,
            timestamp: this.timestamp
        };
    }
}
exports.Click = Click;
//# sourceMappingURL=click.entity.js.map