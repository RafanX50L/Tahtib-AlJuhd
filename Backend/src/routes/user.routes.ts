import { Router } from "express";
import personalizationRouter from "./client/client.personalization.routes";
import verifyToken from "@/middleware/verify.token.middleware";
import isBlocked from "@/middleware/isBlocked.middleware";
import workoutPlanRouter from "./client/client.workoutPlan.routes";
import weeklyChallengeRouter from "./client/client.weeklyChallenge.route";
import userFileRouter from "./shared/userFile.routes";
import dietPlanRouter from "./client/clinet.dietPlan.routes";
import chatBotRouter from "./client/client.chatBot.routes";
import clientTraienrRoot from "./client/client.trainer.routes";
import planRouter from "./domain/plan.routes";

const routerRoot = Router();

routerRoot.use('/',verifyToken('client'),isBlocked());

routerRoot.use(personalizationRouter);
routerRoot.use(workoutPlanRouter);
routerRoot.use(weeklyChallengeRouter);
routerRoot.use(userFileRouter);
routerRoot.use(dietPlanRouter);
routerRoot.use(chatBotRouter);
routerRoot.use(clientTraienrRoot);
routerRoot.use(planRouter);

export default routerRoot;