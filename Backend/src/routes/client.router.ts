import verifyToken from "../middleware/verify.token.middleware";
import { ClientController } from "../controllers/implementation/client.controller";
import { ClientRepository } from "../repositories/implementation/client.repository";
import { ClientService } from "../services/implementation/Client.service";
import { Router } from "express";
import isBlocked from "../middleware/isBlocked.middleware";

const clientRouter = Router();

const clientRepository = new ClientRepository();
const clientService = new ClientService(clientRepository);
const clientController = new ClientController(clientService);

clientRouter.use('/',verifyToken('client'),isBlocked());

clientRouter.post('/generate-fitness-plan',clientController.generateFitnessPlan.bind(clientController));

export default clientRouter;