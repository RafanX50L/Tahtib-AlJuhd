import { IChat } from "@/core/interface/model/IChat";
import { IPlan } from "@/core/interface/model/IPlan";
import { IChatRepository } from "@/core/interface/repositories/IChat.repository";
import { ITrainerClientContractRepository } from "@/core/interface/repositories/ITrainerClientContract.repository";
import { IUserFileRepository } from "@/core/interface/repositories/IUserFile.repository";
import { ITrainerClientService } from "@/core/interface/services/trainer/ITrainer.Clients.Service";
import { generateSignedUrl } from "@/utils/s3Storage.utils";
import { Types } from "mongoose";


export class TrainerClientService implements ITrainerClientService {

  constructor (
    private readonly _contractRepo: ITrainerClientContractRepository,
    private readonly _chatRepo: IChatRepository,
    private readonly _userfileRepo: IUserFileRepository
  ) {}

  async getClients(trainerId: string) {
    const contracts = await this._contractRepo.findActiveContractsByTrainerId(trainerId);
    console.log(contracts);
    return Promise.all(contracts.map(async (contract) => {
      const plan = contract.planId as unknown as IPlan;
      const chat = contract.chatId as unknown as IChat;
      const client: any = contract.clientId;
      const name = client?.personalization?.data?.userData?.nickName || client?.name || 'Unknown Client';
      const photo = await this._userfileRepo.findById(new Types.ObjectId(client?.personalizationId?.data?.userData?.profilePictureId));
      const photoUrl = await generateSignedUrl(photo.filePath);
      const lastMessage = chat?.messages?.[0]?.content;
      const lastMessageTime = chat?.messages?.[0]?.timestamp
        ? `Today, ${new Date(chat.messages[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : undefined;
      return {
        _id: contract.clientId.id,
        name,
        photo:photoUrl,
        planName: plan?.title || 'Custom Plan',
        startDate: contract.startDate.toISOString(),
        endDate: contract.endDate.toISOString(),
        sessionsRemaining: contract.sessionsRemaining,
        chatId: contract.chatId.id.toString(),
        lastMessage,
        lastMessageTime,
      };
    }));
  }

//   async getChatMessages(chatId: string) {
//     const chat = await this._chatRepo.findChatById(chatId);
//     if (!chat) {
//       throw new Error('Chat not found');
//     }
//     return chat.messages.map((msg) => ({
//       text: msg.content,
//       type: 'received', // Type set in frontend based on senderId
//       time: `Today, ${msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
//       senderId: msg.senderId.toString(),
//     }));
//   }

//   async sendMessage(chatId: string, senderId: string, content: string) {
//     const chat = await this._chatRepo.addMessage(chatId, senderId, content);
//     if (!chat) {
//       throw new Error('Chat not found');
//     }
//     const newMessage = chat.messages[chat.messages.length - 1];
//     return {
//       text: newMessage.content,
//       type: 'sent',
//       time: `Today, ${newMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
//       senderId: newMessage.senderId.toString(),
//     };
//   }
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
      senderId: newMessage.senderId.toString(),
    };
  }
}