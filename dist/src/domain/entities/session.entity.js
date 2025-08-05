"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
class Session {
    constructor(id, userId, token, expiresAt, createdAt, ipAddress, userAgent) {
        this.id = id;
        this.userId = userId;
        this.token = token;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
    }
    static create(userId, token, expiresAt, ipAddress, userAgent) {
        return new Session(this.generateId(), userId, token, expiresAt, new Date(), ipAddress || null, userAgent || null);
    }
    isExpired() {
        return new Date() > this.expiresAt;
    }
    updateToken(newToken) {
        return new Session(this.id, this.userId, newToken, this.expiresAt, this.createdAt, this.ipAddress, this.userAgent);
    }
    static generateId() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
}
exports.Session = Session;
//# sourceMappingURL=session.entity.js.map