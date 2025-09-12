import { AdminClientController } from "@/Controller/admin/admin.client.controller";
import { UserRepository } from "@/Repository/user.Repository";
import { AdminClientService } from "@/Services/admin/admin.client.service";
import { Router } from "express";

const adminClinetRoutes = Router();

const userRepository = new UserRepository();
const adminClinetService = new AdminClientService(userRepository);
const adminClientController = new AdminClientController(adminClinetService);

adminClinetRoutes.get('/clients',adminClientController.getAllClient.bind(adminClientController));

export default adminClinetRoutes;