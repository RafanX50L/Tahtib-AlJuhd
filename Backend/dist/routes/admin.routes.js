import isBlocked from "../middleware/isBlocked.middleware";
import { Router } from "express";
import adminClinetRoutes from "./admin/admin.clinet.routes";
import adminTrainerRoutes from "./admin/admin.trainer.routes";
import adminCommonRoutes from "./admin/admin.common.routes";
import { verifyToken } from "../middleware/verify.token.middleware";
const routerRoot = Router();
routerRoot.use('/', verifyToken('admin'), isBlocked());
routerRoot.use(adminClinetRoutes);
routerRoot.use(adminTrainerRoutes);
routerRoot.use(adminCommonRoutes);
export default routerRoot;
//# sourceMappingURL=admin.routes.js.map