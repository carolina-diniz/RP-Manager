export interface IModelMember {
  guildId: string;
  memberId: string;
  nickname: string;
  nameIG: string;
  idIG: string;
  isOnDiscord: boolean;
  alreadyBanned: boolean;
  allowedBy: string;
  recruiterId: string;
  createdAt: Date; 
}