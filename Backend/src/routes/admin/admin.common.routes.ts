import { AdminCommonController } from "@/Controller/admin/admin.common.controller";
import { UserRepository } from "@/Repository/user.Repository";
import { AdminCommonService } from "@/Services/admin/admin.common.service";
import { Router } from "express";

const adminCommonRoutes = Router();

const userRepository = new UserRepository();
const adminCommonService = new AdminCommonService(userRepository);
const adminCommonController = new AdminCommonController(adminCommonService);

adminCommonRoutes.patch('/block-or-unblock/:id',adminCommonController.blockOrUnblock.bind(adminCommonController)); 

export default adminCommonRoutes;