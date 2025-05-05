import { Router } from "express";
import { AdminRepository } from "../repositories/implementation/admin.repository";
import { AdminService } from "../services/implementation/Admin.service";
import { AdminController } from "../controllers/implementation/admin.controller";

const adminRouter = Router();

const aminRepository = new AdminRepository();
const adminService = new AdminService(aminRepository);
const adminController = new AdminController(adminService);


adminRouter.get("/clients", adminController.getAllClients.bind(adminController));
adminRouter.get("/trainers", adminController.getAllTrainers.bind(adminController));
adminRouter.post("/clients/updateStatus",adminController.updateClientStatus.bind(adminController));
adminRouter.post("/trainers/updateStatus",adminController.updateClientStatus.bind(adminController));

export default adminRouter;