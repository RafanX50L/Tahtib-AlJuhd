import { ISession } from "@/core/interface/model/ISession";
import { ISessionView } from "@/core/interface/services/domain/IAvailability.Service";
import { utcToLocalDateTime } from "@/utils/timezone.utils";

export class SessionDto {
  static async mapToISessionData(raw: ISession[], timezone: string = 'UTC'): Promise<ISessionView[]> {
     return raw.map((session) => {
        const startLocal = utcToLocalDateTime(session.startTime, timezone);
        const endLocal = utcToLocalDateTime(session.endTime, timezone);
        
        return {
          id: session.id.toString(),
          trainerId: session.trainerId.toString(),
          clientId: session.clientId.toString(),
          startTime: session.startTime.toISOString(), // Keep UTC for API consistency
          endTime: session.endTime.toISOString(), // Keep UTC for API consistency
          startTimeLocal: startLocal.time, // Add local time for display
          endTimeLocal: endLocal.time, // Add local time for display
          startDateLocal: startLocal.date, // Add local date for display
          endDateLocal: endLocal.date, // Add local date for display
          status: session.status,
          meetingLink: session.meetingLink ?? null,
          createdAt: session.createdAt.toDateString(),
          updatedAt: session.createdAt.toDateString(),
        };
     });
  }
}
