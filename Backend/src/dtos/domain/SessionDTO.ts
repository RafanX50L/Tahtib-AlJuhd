import { ISession } from "@/core/interface/model/ISession";
import { ISessionView } from "@/core/interface/services/domain/IAvailability.Service";

export class SessionDto {
  static async mapToISessionData(raw: ISession[]): Promise<ISessionView[]> {
     return raw.map((session) => ({
        id: session.id.toString(),
        trainerId: session.trainerId.toString(),
        clientId: session.clientId.toString(),
        startTime: session.startTime.toDateString(),
        endTime: session.endTime.toDateString(),
        status: session.status,
        meetingLink: session.meetingLink ?? null,
        createdAt: session.createdAt.toDateString(),
        updatedAt: session.createdAt.toDateString(),
    }));
  }
}
