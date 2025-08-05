export declare class User {
    readonly id: string;
    readonly email: string;
    readonly password: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, email: string, password: string, createdAt: Date, updatedAt: Date);
    static create(email: string, password: string): User;
    private static isValidEmail;
    private static isValidPassword;
    private static generateId;
    updateEmail(email: string): User;
    updatePassword(password: string): User;
    isPasswordValid(plainPassword: string): boolean;
    getPasswordForHashing(): string;
    withHashedPassword(hashedPassword: string): User;
}
//# sourceMappingURL=user.entity.d.ts.map