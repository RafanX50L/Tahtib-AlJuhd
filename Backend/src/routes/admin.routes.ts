import isBlocked from "@/middleware/isBlocked.middleware";
import verifyToken from "@/middleware/verify.token.middleware";
import { Router } from "express";
import adminClinetRoutes from "./admin/admin.clinet.routes";
import adminTrainerRoutes from "./admin/admin.trainer.routes";
import adminCommonRoutes from "./admin/admin.common.routes";

const routerRoot = Router();

routerRoot.use('/',verifyToken('admin'),isBlocked());

routerRoot.use(adminClinetRoutes);
routerRoot.use(adminTrainerRoutes);
routerRoot.use(adminCommonRoutes);

export default routerRoot;