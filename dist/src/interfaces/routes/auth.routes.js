"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRoutes = createAuthRoutes;
const express_1 = require("express");
function createAuthRoutes(authController) {
    const router = (0, express_1.Router)();
    router.post('/register', authController.register);
    router.post('/login', authController.login);
    router.post('/refresh', authController.refresh);
    router.post('/logout', authController.logout);
    return router;
}
//# sourceMappingURL=auth.routes.js.map