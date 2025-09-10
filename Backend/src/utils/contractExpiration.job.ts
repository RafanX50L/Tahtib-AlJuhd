import { PersonalizationRepository } from "@/Repository/personalization.repository";
import { PlanRepository } from "@/Repository/Plan.repository";
import { SessionRepository } from "@/Repository/Session.repository";
import { TrainerPersonalizationRepository } from "@/Repository/Trainer.personalization.repository";
import { TrainerClientContractRepository } from "@/Repository/TrainerClientContract.repository";
import { UserRepository } from "@/Repository/user.Repository";
import { clientTrainerService } from "@/Services/client/client.trainer.service";
import cron from "node-cron";

// inject repositories into service however you’re doing DI
const trainerRepo = new TrainerPersonalizationRepository();
const clinetRepo = new PersonalizationRepository();
const userRepo = new UserRepository();
const planRepo = new PlanRepository();
const contractRepo = new TrainerClientContractRepository();
const sessionRepo = new SessionRepository();
const clinetTrainerServ = new clientTrainerService(trainerRepo,userRepo,clinetRepo,planRepo,contractRepo,sessionRepo);

cron.schedule("* * * * *", async () => {
  console.log("⏰ Running contract expiration check...");
  await clinetTrainerServ.contractExpiration();
});
