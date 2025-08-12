import { ClientTrainerController } from "@/Controller/client/Client.Trainer.Controller";
import { PersonalizationRepository } from "@/Repository/personalization.repository";
import { TrainerPersonalizationRepository } from "@/Repository/Trainer.personalization.repository";
import { UserRepository } from "@/Repository/user.Repository";
import { clientTrainerService } from "@/Services/client/client.trainer.service";
import { Router } from "express";

const clientTraienrRoot = Router();

const trainerRepo = new TrainerPersonalizationRepository();
const clinetRepo = new PersonalizationRepository();
const userRepo = new UserRepository();
const clinetTrainerServ = new clientTrainerService(trainerRepo,userRepo,clinetRepo);
const clinetTraienrCont = new ClientTrainerController(clinetTrainerServ);

clientTraienrRoot.get('/trainers',clinetTraienrCont.getAvailableTrainers.bind(clinetTraienrCont));

export default clientTraienrRoot;