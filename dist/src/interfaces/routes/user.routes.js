"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRoutes = createUserRoutes;
const express_1 = require("express");
function createUserRoutes(userController, authMiddleware) {
    const router = (0, express_1.Router)();
    router.use(authMiddleware.authenticate);
    router.get('/profile', userController.getProfile);
    router.put('/profile', userController.updateProfile);
    router.delete('/account', userController.deleteAccount);
    return router;
}
//# sourceMappingURL=user.routes.js.map