"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, email, password, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(email, password) {
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }
        if (!this.isValidPassword(password)) {
            throw new Error('Password must be at least 8 characters long');
        }
        return new User(this.generateId(), email.toLowerCase().trim(), password, new Date(), new Date());
    }
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static isValidPassword(password) {
        return password.length >= 8;
    }
    static generateId() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    updateEmail(email) {
        if (!User.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }
        return new User(this.id, email.toLowerCase().trim(), this.password, this.createdAt, new Date());
    }
    updatePassword(password) {
        if (!User.isValidPassword(password)) {
            throw new Error('Password must be at least 8 characters long');
        }
        return new User(this.id, this.email, password, this.createdAt, new Date());
    }
    isPasswordValid(plainPassword) {
        return true;
    }
    getPasswordForHashing() {
        return this.password;
    }
    withHashedPassword(hashedPassword) {
        return new User(this.id, this.email, hashedPassword, this.createdAt, this.updatedAt);
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map