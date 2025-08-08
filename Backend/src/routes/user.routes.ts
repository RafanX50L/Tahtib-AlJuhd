import { Router } from "express";
import personalizationRouter from "./client/client.personalization.routes";
import verifyToken from "@/middleware/verify.token.middleware";
import isBlocked from "@/middleware/isBlocked.middleware";
import workoutPlanRouter from "./client/client.workoutPlan.routes";
import weeklyChallengeRouter from "./client/client.weeklyChallenge.route";
import userFileRouter from "./common/userFile.routes";
import dietPlanRouter from "./client/clinet.dietPlan.routes";

const routerRoot = Router();

routerRoot.use('/',verifyToken('client'),isBlocked());

routerRoot.use(personalizationRouter);
routerRoot.use(workoutPlanRouter);
routerRoot.use(weeklyChallengeRouter);
routerRoot.use(userFileRouter);
routerRoot.use(dietPlanRouter);


export default routerRoot;