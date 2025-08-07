import { AdminClinetController } from "@/Controller/admin/admin.client.controller";
import { PersonalizationRepository } from "@/Repository/personalization.repository";
import { UserRepository } from "@/Repository/user.Repository";
import { AdminClientService } from "@/Services/admin/admin.client.service";
import { Router } from "express";

const adminClinetRoutes = Router();

const userRepository = new UserRepository();
const personalizationRepository = new PersonalizationRepository();
const adminClinetService = new AdminClientService(userRepository,personalizationRepository);
const adminClientController = new AdminClinetController(adminClinetService);

adminClinetRoutes.get('/clients',adminClientController.getAllClinet.bind(adminClientController));

export default adminClinetRoutes;