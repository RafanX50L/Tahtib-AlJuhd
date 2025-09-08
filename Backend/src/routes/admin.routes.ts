import isBlocked from "@/middleware/isBlocked.middleware";
import { Router } from "express";
import adminClinetRoutes from "./admin/admin.clinet.routes";
import adminTrainerRoutes from "./admin/admin.trainer.routes";
import adminCommonRoutes from "./admin/admin.common.routes";
import adminProgressRouter from "./admin/admin.progress.routes";
import { verifyToken } from "@/middleware/verify.token.middleware";

const routerRoot = Router();

routerRoot.use('/',verifyToken('admin'),isBlocked());

routerRoot.use(adminClinetRoutes);
routerRoot.use(adminTrainerRoutes);
routerRoot.use(adminCommonRoutes);
routerRoot.use(adminProgressRouter);

export default routerRoot;