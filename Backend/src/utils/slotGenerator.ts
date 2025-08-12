import { PersonalizationModel } from '@/models/Personalization.model';
import { PersonalizationRepository } from '@/Repository/personalization.repository';
import { SessionRepository } from '@/Repository/Session.repository';
import { AvailabilityService } from '@/Services/domain/Availability.service';
import cron from 'node-cron';

const personalizationRepo = new PersonalizationRepository();
const sessionRepo = new SessionRepository();
const availabilityService = new AvailabilityService(personalizationRepo, sessionRepo);

export const slotGenerationJob = cron.schedule('0 0 * * 0', async () => {
  // Ideally, fetch all trainers and loop
  // For simplicity, assume we have trainer IDs
  const trainerIds = await PersonalizationModel.find({ role: 'trainer' }).distinct('userId');
  for (const trainerId of trainerIds) {
    await availabilityService.generateSlots(trainerId.toString(), 4);
  }
});