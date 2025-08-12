import isBlocked from "@/middleware/isBlocked.middleware";
import verifyToken from "@/middleware/verify.token.middleware";
import { Router } from "express";
import personalizationRouter from "./trainer/train.personalization.routes";
import userFileRouter from "./shared/userFile.routes";
import planRouter from "./domain/plan.routes";

const routerRoot = Router();

routerRoot.use('/',verifyToken('trainer'),isBlocked());

routerRoot.use(personalizationRouter);
routerRoot.use(userFileRouter);
routerRoot.use(planRouter);

export default routerRoot;