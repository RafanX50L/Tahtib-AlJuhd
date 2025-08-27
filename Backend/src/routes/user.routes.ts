import { Router } from "express";
import personalizationRouter from "./client/client.personalization.routes";
import isBlocked from "@/middleware/isBlocked.middleware";
import workoutPlanRouter from "./client/client.workoutPlan.routes";
import weeklyChallengeRouter from "./client/client.weeklyChallenge.route";
import userFileRouter from "./shared/userFile.routes";
import dietPlanRouter from "./client/clinet.dietPlan.routes";
import chatBotRouter from "./client/client.chatBot.routes";
import clientTraienrRoot from "./client/client.trainer.routes";
import planRouter from "./domain/plan.routes";
import bookingRouter from "./domain/booking.routes";
import availabilityRouter from "./domain/availability.routes";
import chatRouter from "./shared/chat.routes";
import notificationRouter from "./shared/notification.routes";
import { verifyToken } from "@/middleware/verify.token.middleware";
import schedulingRouter from "./domain/scheduling.routes";

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
routerRoot.use(bookingRouter);  
routerRoot.use(availabilityRouter);
routerRoot.use('/current-trainer',chatRouter);
routerRoot.use('/notifications', notificationRouter);
routerRoot.use('/scheduling', schedulingRouter);

export default routerRoot;