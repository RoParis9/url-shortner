export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(email: string, password: string): User {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!this.isValidPassword(password)) {
      throw new Error('Password must be at least 8 characters long');
    }

    return new User(
      this.generateId(),
      email.toLowerCase().trim(),
      password,
      new Date(),
      new Date()
    );
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public updateEmail(email: string): User {
    if (!User.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    return new User(
      this.id,
      email.toLowerCase().trim(),
      this.password,
      this.createdAt,
      new Date()
    );
  }

  public updatePassword(password: string): User {
    if (!User.isValidPassword(password)) {
      throw new Error('Password must be at least 8 characters long');
    }

    return new User(
      this.id,
      this.email,
      password,
      this.createdAt,
      new Date()
    );
  }

  // Domain methods for password validation
  public isPasswordValid(plainPassword: string): boolean {
    // This should be implemented by infrastructure layer
    // Domain only defines the contract
    return true;
  }

  public getPasswordForHashing(): string {
    return this.password;
  }

  public withHashedPassword(hashedPassword: string): User {
    return new User(
      this.id,
      this.email,
      hashedPassword,
      this.createdAt,
      this.updatedAt
    );
  }
} 