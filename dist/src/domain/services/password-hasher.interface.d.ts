export interface PasswordHasher {
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
}
//# sourceMappingURL=password-hasher.interface.d.ts.map