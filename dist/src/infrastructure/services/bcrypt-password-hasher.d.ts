import { PasswordHasher } from '../../domain/services/password-hasher.interface';
export declare class BcryptPasswordHasher implements PasswordHasher {
    private readonly saltRounds;
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
}
//# sourceMappingURL=bcrypt-password-hasher.d.ts.map