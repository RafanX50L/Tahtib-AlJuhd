import { ClientTrainerController } from "@/Controller/client/Client.Trainer.Controller";
import { PersonalizationRepository } from "@/Repository/personalization.repository";
import { PlanRepository } from "@/Repository/Plan.repository";
import { TrainerPersonalizationRepository } from "@/Repository/Trainer.personalization.repository";
import { TrainerClientContractRepository } from "@/Repository/TrainerClientContract.repository";
import { UserRepository } from "@/Repository/user.Repository";
import { clientTrainerService } from "@/Services/client/client.trainer.service";
import { Router } from "express";

const clientTraienrRoot = Router();

const trainerRepo = new TrainerPersonalizationRepository();
const clinetRepo = new PersonalizationRepository();
const userRepo = new UserRepository();
const planRepo = new PlanRepository();
const contractRepo = new TrainerClientContractRepository();
const clinetTrainerServ = new clientTrainerService(trainerRepo,userRepo,clinetRepo,planRepo,contractRepo);
const clinetTraienrCont = new ClientTrainerController(clinetTrainerServ);

clientTraienrRoot.get('/trainers',clinetTraienrCont.getAvailableTrainers.bind(clinetTraienrCont));
clientTraienrRoot.get('/trainer/:id',clinetTraienrCont.getTrainerById.bind(clinetTraienrCont));
clientTraienrRoot.get('/current-trainer',clinetTraienrCont.getCurrentTrainer.bind(clinetTraienrCont));
clientTraienrRoot.get('/current-trainer/contract',clinetTraienrCont.getCurrentTrainerContract.bind(clinetTraienrCont));

export default clientTraienrRoot;