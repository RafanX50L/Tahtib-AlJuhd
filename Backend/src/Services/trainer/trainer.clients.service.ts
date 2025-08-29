import { IChat } from "@/core/interface/model/IChat";
import { IClientPersonalization, IPersonalization } from "@/core/interface/model/IPersonalization.model";
import { IPlan } from "@/core/interface/model/IPlan";
import IUser from "@/core/interface/model/IUser.model";
import { IChatRepository } from "@/core/interface/repositories/IChat.repository";
import { ITrainerClientContractRepository } from "@/core/interface/repositories/ITrainerClientContract.repository";
import { IUserFileRepository } from "@/core/interface/repositories/IUserFile.repository";
import { IGetClentInterface, ITrainerClientService } from "@/core/interface/services/trainer/ITrainer.Clients.Service";
import { generateSignedUrl } from "@/utils/s3Storage.utils";
import { Types } from "mongoose";


export class TrainerClientService implements ITrainerClientService {

  constructor (
    private readonly _contractRepo: ITrainerClientContractRepository,
    private readonly _chatRepo: IChatRepository,
    private readonly _userfileRepo: IUserFileRepository
  ) {}

  async getClients(trainerId: string): Promise<IGetClentInterface[]> {
    const contracts = await this._contractRepo.findActiveContractsByTrainerId(trainerId);
    console.log(contracts);
    return Promise.all(contracts.map(async (contract) => {
      const plan = contract.planId as unknown as IPlan;
      const chat = contract.chatId as unknown as IChat;
      const client = contract.clientId as unknown as IUser;
      const personalization = (client.personalizationId as unknown as IPersonalization).data as IClientPersonalization;
      const photo = await this._userfileRepo.findById(personalization.userData.profilePictureId as Types.ObjectId);
      const photoUrl = photo ? await generateSignedUrl(photo.filePath ) : null;
      console.log('nice');
      console.log('mesaages',chat?.messages[chat?.messages.length-1]?.content);
      const lastMessage = chat?.messages?.[chat.messages.length - 1];
      let lastMessageTime: string | undefined;

      if (lastMessage?.timestamp) {
        const messageDate = new Date(lastMessage.timestamp);
        const now = new Date();

        const isToday = messageDate.toDateString() === now.toDateString();

        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = messageDate.toDateString() === yesterday.toDateString();

        const time = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (isToday) {
          lastMessageTime = `Today, ${time}`;
        } else if (isYesterday) {
          lastMessageTime = `Yesterday, ${time}`;
        } else {
          lastMessageTime = `${messageDate.toLocaleDateString()}, ${time}`;
        }
      }

      return {
        _id: contract.clientId.id.toString(),
        name: client?.name,
        photo: photoUrl,
        planName: plan?.title || 'Custom Plan',
        startDate: contract.startDate.toISOString(),
        endDate: contract.endDate.toISOString(),
        sessionsRemaining: contract.sessionsRemaining,
        chatId: contract.chatId.id.toString(),
        lastMessage: lastMessage?.content,
        lastMessageTime,
      };
    }));
  }

  async sendMessage(chatId: string, senderId: string, content: string) {
    const chat = await this._chatRepo.addMessage(chatId, senderId, content);
    if (!chat) {
      throw new Error('Chat not found');
    }
    const newMessage = chat.messages[chat.messages.length - 1];
    return {
      text: newMessage.content,
      type: 'sent',
      time: `Today, ${newMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      sender: newMessage.senderId.toString(),
    };
  }
}