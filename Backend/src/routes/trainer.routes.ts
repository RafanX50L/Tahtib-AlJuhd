import isBlocked from "@/middleware/isBlocked.middleware";
import verifyToken from "@/middleware/verify.token.middleware";
import { Router } from "express";
import personalizationRouter from "./trainer/train.personalization.routes";
import userFileRouter from "./common/userFile.routes";

const routerRoot = Router();

routerRoot.use('/',verifyToken('trainer'),isBlocked());

routerRoot.use(personalizationRouter);
routerRoot.use(userFileRouter);

export default routerRoot;