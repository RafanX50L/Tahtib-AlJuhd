import isBlocked from "../middleware/isBlocked.middleware";
import { Router } from "express";
import personalizationRouter from "./trainer/train.personalization.routes";
import userFileRouter from "./shared/userFile.routes";
import planRouter from "./domain/plan.routes";
import availabilityRouter from "./domain/availability.routes";
import clientsRouter from "./trainer/trainer.clients.routes";
import { verifyToken } from "../middleware/verify.token.middleware";
const routerRoot = Router();
routerRoot.use('/', verifyToken('trainer'), isBlocked());
routerRoot.use(personalizationRouter);
routerRoot.use(userFileRouter);
routerRoot.use(planRouter);
routerRoot.use(availabilityRouter);
routerRoot.use(clientsRouter);
export default routerRoot;
//# sourceMappingURL=trainer.routes.js.map