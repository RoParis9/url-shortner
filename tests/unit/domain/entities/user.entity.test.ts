import { User } from "@/domain/entities/user.entity";


describe('User Entity', () => {
  describe('create', () => {
    it('should create a user with valid email and password', () => {
      const email = 'test@example.com';
      const password = 'password123';

      const user = User.create(email, password);

      expect(user.email).toBe(email.toLowerCase());
      expect(user.password).toBe(password);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw error for invalid email', () => {
      const invalidEmail = 'invalid-email';
      const password = 'password123';

      expect(() => User.create(invalidEmail, password)).toThrow('Invalid email format');
    });

    it('should throw error for short password', () => {
      const email = 'test@example.com';
      const shortPassword = '123';

      expect(() => User.create(email, shortPassword)).toThrow('Password must be at least 8 characters long');
    });

    it('should normalize email to lowercase', () => {
      const email = 'TEST@EXAMPLE.COM';
      const password = 'password123';

      const user = User.create(email, password);

      expect(user.email).toBe('test@example.com');
    });
  });

  describe('updateEmail', () => {
    it('should update email with valid format', () => {
      const user = User.create('old@example.com', 'password123');
      const newEmail = 'new@example.com';

      const updatedUser = user.updateEmail(newEmail);

      expect(updatedUser.email).toBe(newEmail.toLowerCase());
      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.password).toBe(user.password);
      expect(updatedUser.createdAt).toEqual(user.createdAt);
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(user.updatedAt.getTime());
    });

    it('should throw error for invalid email format', () => {
      const user = User.create('test@example.com', 'password123');
      const invalidEmail = 'invalid-email';

      expect(() => user.updateEmail(invalidEmail)).toThrow('Invalid email format');
    });
  });

  describe('updatePassword', () => {
    it('should update password with valid length', () => {
      const user = User.create('test@example.com', 'oldpassword123');
      const newPassword = 'newpassword123';

      const updatedUser = user.updatePassword(newPassword);

      expect(updatedUser.password).toBe(newPassword);
      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.email).toBe(user.email);
      expect(updatedUser.createdAt).toEqual(user.createdAt);
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(user.updatedAt.getTime());
    });

    it('should throw error for short password', () => {
      const user = User.create('test@example.com', 'password123');
      const shortPassword = '123';

      expect(() => user.updatePassword(shortPassword)).toThrow('Password must be at least 8 characters long');
    });
  });
}); 