export interface ICurrentTrainerContractView {
  id: string;
  chatId: string;
  sessionsRemaining: number;
  trainerId: string;
  planName: string;
  endDate: Date;
}