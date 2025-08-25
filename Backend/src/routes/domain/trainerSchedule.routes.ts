import { Router } from "express";
import { ITrainerScheduleController } from "@/core/interface/controllers/domain/ITrainerSchedule.controller";
import { verifyToken } from "@/middleware/verify.token.middleware";

export const createTrainerScheduleRoutes = (
  trainerScheduleController: ITrainerScheduleController
): Router => {
  const router = Router();

  // All routes require authentication
  router.use(verifyToken);

  // Create or update trainer schedule
  router.post("/", trainerScheduleController.createSchedule.bind(trainerScheduleController));
  router.put("/", trainerScheduleController.updateSchedule.bind(trainerScheduleController));

  // Get trainer's own schedule
  router.get("/", trainerScheduleController.getSchedule.bind(trainerScheduleController));

  // Get available slots for a specific trainer (public endpoint)
  router.get("/:trainerId/slots", trainerScheduleController.getAvailableSlots.bind(trainerScheduleController));

  // Toggle schedule active/inactive
  router.patch("/toggle", trainerScheduleController.toggleScheduleActive.bind(trainerScheduleController));

  return router;
};
