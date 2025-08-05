"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const client_1 = require("@prisma/client");
const prisma_url_repository_1 = require("./repositories/prisma-url.repository");
const prisma_user_repository_1 = require("./repositories/prisma-user.repository");
const prisma_click_repository_1 = require("./repositories/prisma-click.repository");
const prisma_session_repository_1 = require("./repositories/prisma-session.repository");
const prisma_analytics_repository_1 = require("./repositories/prisma-analytics.repository");
const bcrypt_password_hasher_1 = require("./services/bcrypt-password-hasher");
const jwt_token_generator_1 = require("./services/jwt-token-generator");
const create_url_use_case_1 = require("../application/use-cases/url/create-url.use-case");
const get_user_urls_use_case_1 = require("../application/use-cases/url/get-user-urls.use-case");
const update_url_use_case_1 = require("../application/use-cases/url/update-url.use-case");
const delete_url_use_case_1 = require("../application/use-cases/url/delete-url.use-case");
const redirect_url_use_case_1 = require("../application/use-cases/url/redirect-url.use-case");
const bulk_create_urls_use_case_1 = require("../application/use-cases/bulk/bulk-create-urls.use-case");
const register_user_use_case_1 = require("../application/use-cases/auth/register-user.use-case");
const login_user_use_case_1 = require("../application/use-cases/auth/login-user.use-case");
const refresh_token_use_case_1 = require("../application/use-cases/auth/refresh-token.use-case");
const logout_user_use_case_1 = require("../application/use-cases/auth/logout-user.use-case");
const get_url_analytics_use_case_1 = require("../application/use-cases/analytics/get-url-analytics.use-case");
const update_user_profile_use_case_1 = require("../application/use-cases/user/update-user-profile.use-case");
const delete_user_account_use_case_1 = require("../application/use-cases/user/delete-user-account.use-case");
const url_controller_1 = require("../interfaces/controllers/url.controller");
const auth_controller_1 = require("../interfaces/controllers/auth.controller");
const analytics_controller_1 = require("../interfaces/controllers/analytics.controller");
const user_controller_1 = require("../interfaces/controllers/user.controller");
const auth_middleware_1 = require("./middleware/auth.middleware");
class Container {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    static getInstance() {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }
    getPrisma() {
        return this.prisma;
    }
    getUrlRepository() {
        return new prisma_url_repository_1.PrismaUrlRepository(this.prisma);
    }
    getUserRepository() {
        return new prisma_user_repository_1.PrismaUserRepository(this.prisma);
    }
    getClickRepository() {
        return new prisma_click_repository_1.PrismaClickRepository(this.prisma);
    }
    getSessionRepository() {
        return new prisma_session_repository_1.PrismaSessionRepository(this.prisma);
    }
    getAnalyticsRepository() {
        return new prisma_analytics_repository_1.PrismaAnalyticsRepository(this.prisma);
    }
    getPasswordHasher() {
        return new bcrypt_password_hasher_1.BcryptPasswordHasher();
    }
    getTokenGenerator() {
        return new jwt_token_generator_1.JwtTokenGenerator(process.env.JWT_SECRET || 'default-secret', process.env.JWT_REFRESH_SECRET || 'default-refresh-secret');
    }
    getCreateUrlUseCase() {
        return new create_url_use_case_1.CreateUrlUseCase(this.getUrlRepository(), process.env.BASE_URL || 'http://localhost:3000');
    }
    getGetUserUrlsUseCase() {
        return new get_user_urls_use_case_1.GetUserUrlsUseCase(this.getUrlRepository());
    }
    getUpdateUrlUseCase() {
        return new update_url_use_case_1.UpdateUrlUseCase(this.getUrlRepository());
    }
    getDeleteUrlUseCase() {
        return new delete_url_use_case_1.DeleteUrlUseCase(this.getUrlRepository());
    }
    getRedirectUrlUseCase() {
        return new redirect_url_use_case_1.RedirectUrlUseCase(this.getUrlRepository(), this.getClickRepository());
    }
    getBulkCreateUrlsUseCase() {
        return new bulk_create_urls_use_case_1.BulkCreateUrlsUseCase(this.getUrlRepository(), process.env.BASE_URL || 'http://localhost:3000');
    }
    getRegisterUserUseCase() {
        return new register_user_use_case_1.RegisterUserUseCase(this.getUserRepository(), this.getPasswordHasher());
    }
    getLoginUserUseCase() {
        return new login_user_use_case_1.LoginUserUseCase(this.getUserRepository(), this.getSessionRepository(), this.getPasswordHasher(), this.getTokenGenerator());
    }
    getRefreshTokenUseCase() {
        return new refresh_token_use_case_1.RefreshTokenUseCase(this.getUserRepository(), this.getSessionRepository(), this.getTokenGenerator());
    }
    getLogoutUserUseCase() {
        return new logout_user_use_case_1.LogoutUserUseCase(this.getSessionRepository());
    }
    getGetUrlAnalyticsUseCase() {
        return new get_url_analytics_use_case_1.GetUrlAnalyticsUseCase(this.getUrlRepository(), this.getClickRepository(), this.getAnalyticsRepository());
    }
    getUpdateUserProfileUseCase() {
        return new update_user_profile_use_case_1.UpdateUserProfileUseCase(this.getUserRepository(), this.getPasswordHasher());
    }
    getDeleteUserAccountUseCase() {
        return new delete_user_account_use_case_1.DeleteUserAccountUseCase(this.getUserRepository(), this.getSessionRepository(), this.getPasswordHasher());
    }
    getUrlController() {
        return new url_controller_1.UrlController(this.getCreateUrlUseCase(), this.getGetUserUrlsUseCase(), this.getUpdateUrlUseCase(), this.getDeleteUrlUseCase(), this.getRedirectUrlUseCase(), this.getBulkCreateUrlsUseCase());
    }
    getAuthController() {
        return new auth_controller_1.AuthController(this.getRegisterUserUseCase(), this.getLoginUserUseCase(), this.getRefreshTokenUseCase(), this.getLogoutUserUseCase());
    }
    getAnalyticsController() {
        return new analytics_controller_1.AnalyticsController(this.getGetUrlAnalyticsUseCase());
    }
    getUserController() {
        return new user_controller_1.UserController(this.getUpdateUserProfileUseCase(), this.getDeleteUserAccountUseCase());
    }
    getAuthMiddleware() {
        return new auth_middleware_1.AuthMiddleware(this.getTokenGenerator());
    }
    async disconnect() {
        await this.prisma.$disconnect();
    }
}
exports.Container = Container;
//# sourceMappingURL=container.js.map