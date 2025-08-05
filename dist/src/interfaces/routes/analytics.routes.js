"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnalyticsRoutes = createAnalyticsRoutes;
const express_1 = require("express");
function createAnalyticsRoutes(analyticsController, authMiddleware) {
    const router = (0, express_1.Router)();
    router.use(authMiddleware.authenticate);
    router.get('/urls/:urlId', analyticsController.getUrlAnalytics);
    router.get('/dashboard', analyticsController.getDashboardStats);
    return router;
}
//# sourceMappingURL=analytics.routes.js.map