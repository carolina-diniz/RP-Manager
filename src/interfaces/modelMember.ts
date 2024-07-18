export interface IMember {
  id: string;
  IGName: string | null;
  IGId: string | null;
  nickname: string | null;
  guildId: string;
  user: {
    globalName: string | null;
    createdTimestamp: number;
    tag: string;
    bot: boolean;
    displayName: string;
    id: string;
    username: string;
  }
  pd: {
    isPemaBanned: boolean;
    permaDeathReason: string;
    whoBanned: string | null;
  };
  joinedAt: Date;
  leftAt: Date | null;
}