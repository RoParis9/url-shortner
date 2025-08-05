"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUrlRoutes = createUrlRoutes;
const express_1 = require("express");
function createUrlRoutes(urlController, authMiddleware) {
    const router = (0, express_1.Router)();
    router.post('/public', urlController.createPublicUrl);
    router.get('/:shortCode', urlController.redirect);
    router.use(authMiddleware.authenticate);
    router.post('/', urlController.createUrl);
    router.get('/', urlController.getUserUrls);
    router.put('/:urlId', urlController.updateUrl);
    router.delete('/:urlId', urlController.deleteUrl);
    router.post('/bulk', urlController.bulkCreateUrls);
    return router;
}
//# sourceMappingURL=url.routes.js.map