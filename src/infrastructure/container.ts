import { PrismaClient } from '@prisma/client';

// Repositories
import { PrismaUrlRepository } from './repositories/prisma-url.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaClickRepository } from './repositories/prisma-click.repository';
import { PrismaSessionRepository } from './repositories/prisma-session.repository';
import { PrismaAnalyticsRepository } from './repositories/prisma-analytics.repository';


// Services
import { BcryptPasswordHasher } from './services/bcrypt-password-hasher';
import { JwtTokenGenerator } from './services/jwt-token-generator';

// Use Cases
import { CreateUrlUseCase } from '../application/use-cases/url/create-url.use-case';
import { GetUserUrlsUseCase } from '../application/use-cases/url/get-user-urls.use-case';
import { UpdateUrlUseCase } from '../application/use-cases/url/update-url.use-case';
import { DeleteUrlUseCase } from '../application/use-cases/url/delete-url.use-case';
import { RedirectUrlUseCase } from '../application/use-cases/url/redirect-url.use-case';
import { BulkCreateUrlsUseCase } from '../application/use-cases/bulk/bulk-create-urls.use-case';
import { RegisterUserUseCase } from '../application/use-cases/auth/register-user.use-case';
import { LoginUserUseCase } from '../application/use-cases/auth/login-user.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/auth/refresh-token.use-case';
import { LogoutUserUseCase } from '../application/use-cases/auth/logout-user.use-case';
import { GetUrlAnalyticsUseCase } from '../application/use-cases/analytics/get-url-analytics.use-case';

import { UpdateUserProfileUseCase } from '../application/use-cases/user/update-user-profile.use-case';
import { DeleteUserAccountUseCase } from '../application/use-cases/user/delete-user-account.use-case';

// Controllers
import { UrlController } from '../interfaces/controllers/url.controller';
import { AuthController } from '../interfaces/controllers/auth.controller';
import { AnalyticsController } from '../interfaces/controllers/analytics.controller';
import { UserController } from '../interfaces/controllers/user.controller';

// Middleware
import { AuthMiddleware } from './middleware/auth.middleware';

export class Container {
  private static instance: Container;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  // Database
  getPrisma(): PrismaClient {
    return this.prisma;
  }

  // Repositories
  getUrlRepository(): PrismaUrlRepository {
    return new PrismaUrlRepository(this.prisma);
  }

  getUserRepository(): PrismaUserRepository {
    return new PrismaUserRepository(this.prisma);
  }

  getClickRepository(): PrismaClickRepository {
    return new PrismaClickRepository(this.prisma);
  }

  getSessionRepository(): PrismaSessionRepository {
    return new PrismaSessionRepository(this.prisma);
  }

  getAnalyticsRepository(): PrismaAnalyticsRepository {
    return new PrismaAnalyticsRepository(this.prisma);
  }



  // Services
  getPasswordHasher(): BcryptPasswordHasher {
    return new BcryptPasswordHasher();
  }

  getTokenGenerator(): JwtTokenGenerator {
    return new JwtTokenGenerator(
      process.env.JWT_SECRET || 'default-secret',
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret'
    );
  }

  // Use Cases
  getCreateUrlUseCase(): CreateUrlUseCase {
    return new CreateUrlUseCase(
      this.getUrlRepository(),
      process.env.BASE_URL || 'http://localhost:3000'
    );
  }

  getGetUserUrlsUseCase(): GetUserUrlsUseCase {
    return new GetUserUrlsUseCase(this.getUrlRepository());
  }

  getUpdateUrlUseCase(): UpdateUrlUseCase {
    return new UpdateUrlUseCase(this.getUrlRepository());
  }

  getDeleteUrlUseCase(): DeleteUrlUseCase {
    return new DeleteUrlUseCase(this.getUrlRepository());
  }

  getRedirectUrlUseCase(): RedirectUrlUseCase {
    return new RedirectUrlUseCase(
      this.getUrlRepository(),
      this.getClickRepository()
    );
  }

  getBulkCreateUrlsUseCase(): BulkCreateUrlsUseCase {
    return new BulkCreateUrlsUseCase(
      this.getUrlRepository(),
      process.env.BASE_URL || 'http://localhost:3000'
    );
  }

  getRegisterUserUseCase(): RegisterUserUseCase {
    return new RegisterUserUseCase(
      this.getUserRepository(),
      this.getPasswordHasher()
    );
  }

  getLoginUserUseCase(): LoginUserUseCase {
    return new LoginUserUseCase(
      this.getUserRepository(),
      this.getSessionRepository(),
      this.getPasswordHasher(),
      this.getTokenGenerator()
    );
  }

  getRefreshTokenUseCase(): RefreshTokenUseCase {
    return new RefreshTokenUseCase(
      this.getUserRepository(),
      this.getSessionRepository(),
      this.getTokenGenerator()
    );
  }

  getLogoutUserUseCase(): LogoutUserUseCase {
    return new LogoutUserUseCase(this.getSessionRepository());
  }

  getGetUrlAnalyticsUseCase(): GetUrlAnalyticsUseCase {
    return new GetUrlAnalyticsUseCase(
      this.getUrlRepository(),
      this.getClickRepository(),
      this.getAnalyticsRepository()
    );
  }



  getUpdateUserProfileUseCase(): UpdateUserProfileUseCase {
    return new UpdateUserProfileUseCase(
      this.getUserRepository(),
      this.getPasswordHasher()
    );
  }

  getDeleteUserAccountUseCase(): DeleteUserAccountUseCase {
    return new DeleteUserAccountUseCase(
      this.getUserRepository(),
      this.getSessionRepository(),
      this.getPasswordHasher()
    );
  }

  // Controllers
  getUrlController(): UrlController {
    return new UrlController(
      this.getCreateUrlUseCase(),
      this.getGetUserUrlsUseCase(),
      this.getUpdateUrlUseCase(),
      this.getDeleteUrlUseCase(),
      this.getRedirectUrlUseCase(),
      this.getBulkCreateUrlsUseCase()
    );
  }

  getAuthController(): AuthController {
    return new AuthController(
      this.getRegisterUserUseCase(),
      this.getLoginUserUseCase(),
      this.getRefreshTokenUseCase(),
      this.getLogoutUserUseCase()
    );
  }

  getAnalyticsController(): AnalyticsController {
    return new AnalyticsController(
      this.getGetUrlAnalyticsUseCase()
    );
  }

  getUserController(): UserController {
    return new UserController(
      this.getUpdateUserProfileUseCase(),
      this.getDeleteUserAccountUseCase()
    );
  }

  // Middleware
  getAuthMiddleware(): AuthMiddleware {
    return new AuthMiddleware(
      this.getTokenGenerator()
    );
  }

  // Cleanup
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
} 