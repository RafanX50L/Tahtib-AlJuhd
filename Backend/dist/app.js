"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
// validate env
const validate_env_utils_1 = require("./utils/validate-env.utils");
(0, validate_env_utils_1.validateEnv)();
// configs
const mongo_config_1 = require("./config/mongo.config");
const env_config_1 = require("./config/env.config");
// middlewares
const error_middleware_1 = require("./middleware/error.middleware");
// cron jobs
require("./utils/createWeeklyChallenge.cron");
//routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const trainer_routes_1 = __importDefault(require("./routes/trainer.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const notification_routes_1 = __importDefault(require("./routes/shared/notification.routes"));
const scheduling_routes_1 = __importDefault(require("./routes/domain/scheduling.routes"));
const payment_routes_1 = __importDefault(require("./routes/shared/payment.routes"));
const webhook_routes_1 = __importDefault(require("./routes/domain/webhook.routes"));
const community_routes_1 = __importDefault(require("./routes/shared/community.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/client/dashboard.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: env_config_1.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-token-version'],
}));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
(0, mongo_config_1.connectDb)();
app.use('/api/payment/webhook', webhook_routes_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/client/', user_routes_1.default);
app.use('/api/client/dashboard', dashboard_routes_1.default);
app.use('/api/trainer', trainer_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/payment', payment_routes_1.default);
app.use('/api/scheduling', scheduling_routes_1.default);
app.use('/api/community', community_routes_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map