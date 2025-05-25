import { Router } from 'express';
import { AdminRepository } from '../repositories/implementation/admin.repository';
import { AdminService } from '../services/implementation/Admin.service';
import { AdminController } from '../controllers/implementation/admin.controller';
import verifyToken from '../middleware/verify.token.middleware';
import isBlocked from '../middleware/isBlocked.middleware';

const adminRouter = Router();

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

adminRouter.use('/', verifyToken('admin'), isBlocked()); // Apply middleware to all admin routes

adminRouter.get('/clients', adminController.getAllClients.bind(adminController));
adminRouter.get('/trainers', adminController.getAllTrainers.bind(adminController));
adminRouter.post('/clients/updateStatus', adminController.updateClientStatus.bind(adminController));
adminRouter.post('/trainers/updateStatus', adminController.updateTrainerStatus.bind(adminController));

export default adminRouter;