"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isBlocked_middleware_1 = __importDefault(require("../middleware/isBlocked.middleware"));
const express_1 = require("express");
const admin_clinet_routes_1 = __importDefault(require("./admin/admin.clinet.routes"));
const admin_trainer_routes_1 = __importDefault(require("./admin/admin.trainer.routes"));
const admin_common_routes_1 = __importDefault(require("./admin/admin.common.routes"));
const verify_token_middleware_1 = require("../middleware/verify.token.middleware");
const routerRoot = (0, express_1.Router)();
routerRoot.use('/', (0, verify_token_middleware_1.verifyToken)('admin'), (0, isBlocked_middleware_1.default)());
routerRoot.use(admin_clinet_routes_1.default);
routerRoot.use(admin_trainer_routes_1.default);
routerRoot.use(admin_common_routes_1.default);
exports.default = routerRoot;
//# sourceMappingURL=admin.routes.js.map