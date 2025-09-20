import { IPlan } from "@/core/interface/model/IPlan";
import { IPlanView } from "@/core/interface/services/domain/IPlan.Service";


export class PlanDto {
  static async mapToPlanData(raw: IPlan): Promise<IPlanView> {
    return {
      id: raw._id.toString(),
      trainer: raw.trainerId.toString(),
      title: raw.title,
      description: raw.description,
      price: raw.price,
      sessionsPerWeek: raw.sessionsPerWeek,
      durationWeeks: raw.durationWeeks,
      isActive: raw.isActive,
      isBooked: raw.isBooked,
      createdAt: raw.createdAt?.toISOString(),
    };
  }
}
