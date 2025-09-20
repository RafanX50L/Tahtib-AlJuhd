import { TrainerClientsController } from "@/Controller/trainer/trainer.clients.controller";
import { ChatRepository } from "@/Repository/Chat.repository";
import { TrainerClientContractRepository } from "@/Repository/TrainerClientContract.repository";
import { UserFileRepository } from "@/Repository/UserFile.repository";
import { ChatService } from "@/Services/shared/chat.service";
import { TrainerClientService } from "@/Services/trainer/trainer.clients.service";
import { Router } from "express";

const clientsRouter = Router();

const contractRepo = new TrainerClientContractRepository();
const chatRepo = new ChatRepository();
const userFileRepo = new UserFileRepository();
const trainerClientServ = new TrainerClientService(contractRepo,chatRepo,userFileRepo);
const chatServ = new ChatService(chatRepo);
const trainerClientContr = new TrainerClientsController(trainerClientServ, chatServ);

clientsRouter.get('/clients', trainerClientContr.getClients.bind(trainerClientContr));
clientsRouter.get('/chat/:chatId/messages', trainerClientContr.getChatMessages.bind(trainerClientContr));

export default clientsRouter;