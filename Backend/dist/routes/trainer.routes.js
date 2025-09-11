"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isBlocked_middleware_1 = __importDefault(require("../middleware/isBlocked.middleware"));
const express_1 = require("express");
const train_personalization_routes_1 = __importDefault(require("./trainer/train.personalization.routes"));
const userFile_routes_1 = __importDefault(require("./shared/userFile.routes"));
const plan_routes_1 = __importDefault(require("./domain/plan.routes"));
const availability_routes_1 = __importDefault(require("./domain/availability.routes"));
const trainer_clients_routes_1 = __importDefault(require("./trainer/trainer.clients.routes"));
const trainer_dashboard_routes_1 = __importDefault(require("./trainer/trainer.dashboard.routes"));
const verify_token_middleware_1 = require("../middleware/verify.token.middleware");
const routerRoot = (0, express_1.Router)();
routerRoot.use('/', (0, verify_token_middleware_1.verifyToken)('trainer'), (0, isBlocked_middleware_1.default)());
routerRoot.use(train_personalization_routes_1.default);
routerRoot.use(userFile_routes_1.default);
routerRoot.use(plan_routes_1.default);
routerRoot.use(availability_routes_1.default);
routerRoot.use(trainer_clients_routes_1.default);
routerRoot.use(trainer_dashboard_routes_1.default);
exports.default = routerRoot;
//# sourceMappingURL=trainer.routes.js.map