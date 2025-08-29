export interface IGetClentInterface {
  _id: string;                 
  name: string;                
  photo: string;               
  planName: string;            
  startDate: string;           
  endDate: string;             
  sessionsRemaining: number;   
  chatId: string;              
  lastMessage?: string;        
  lastMessageTime?: string;    
}

export interface ITrainerClientService{
    getClients(trainerId: string):Promise<IGetClentInterface[]>;
}