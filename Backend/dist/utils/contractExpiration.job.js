var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PersonalizationRepository } from "../Repository/personalization.repository";
import { PlanRepository } from "../Repository/Plan.repository";
import { SessionRepository } from "../Repository/Session.repository";
import { TrainerPersonalizationRepository } from "../Repository/Trainer.personalization.repository";
import { TrainerClientContractRepository } from "../Repository/TrainerClientContract.repository";
import { UserRepository } from "../Repository/user.Repository";
import { clientTrainerService } from "../Services/client/client.trainer.service";
import cron from "node-cron";
// inject repositories into service however you’re doing DI
const trainerRepo = new TrainerPersonalizationRepository();
const clinetRepo = new PersonalizationRepository();
const userRepo = new UserRepository();
const planRepo = new PlanRepository();
const contractRepo = new TrainerClientContractRepository();
const sessionRepo = new SessionRepository();
const clinetTrainerServ = new clientTrainerService(trainerRepo, userRepo, clinetRepo, planRepo, contractRepo, sessionRepo);
cron.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("⏰ Running contract expiration check...");
    yield clinetTrainerServ.contractExpiration();
}));
//# sourceMappingURL=contractExpiration.job.js.map