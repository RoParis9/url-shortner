"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtTokenGenerator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtTokenGenerator {
    constructor(jwtSecret, jwtRefreshSecret) {
        this.jwtSecret = jwtSecret;
        this.jwtRefreshSecret = jwtRefreshSecret;
    }
    generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign({
            ...payload,
            type: 'access'
        }, this.jwtSecret, { expiresIn: '15m' });
    }
    generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign({
            ...payload,
            type: 'refresh'
        }, this.jwtRefreshSecret, { expiresIn: '7d' });
    }
    verifyToken(token, type) {
        const secret = type === 'access' ? this.jwtSecret : this.jwtRefreshSecret;
        return jsonwebtoken_1.default.verify(token, secret);
    }
}
exports.JwtTokenGenerator = JwtTokenGenerator;
//# sourceMappingURL=jwt-token-generator.js.map