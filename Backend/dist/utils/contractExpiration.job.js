"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const personalization_repository_1 = require("../Repository/personalization.repository");
const Plan_repository_1 = require("../Repository/Plan.repository");
const Session_repository_1 = require("../Repository/Session.repository");
const Trainer_personalization_repository_1 = require("../Repository/Trainer.personalization.repository");
const TrainerClientContract_repository_1 = require("../Repository/TrainerClientContract.repository");
const user_Repository_1 = require("../Repository/user.Repository");
const client_trainer_service_1 = require("../Services/client/client.trainer.service");
const node_cron_1 = __importDefault(require("node-cron"));
// inject repositories into service however you’re doing DI
const trainerRepo = new Trainer_personalization_repository_1.TrainerPersonalizationRepository();
const clinetRepo = new personalization_repository_1.PersonalizationRepository();
const userRepo = new user_Repository_1.UserRepository();
const planRepo = new Plan_repository_1.PlanRepository();
const contractRepo = new TrainerClientContract_repository_1.TrainerClientContractRepository();
const sessionRepo = new Session_repository_1.SessionRepository();
const clinetTrainerServ = new client_trainer_service_1.clientTrainerService(trainerRepo, userRepo, clinetRepo, planRepo, contractRepo, sessionRepo);
node_cron_1.default.schedule("* * * * *", async () => {
    console.log("⏰ Running contract expiration check...");
    await clinetTrainerServ.contractExpiration();
});
//# sourceMappingURL=contractExpiration.job.js.map