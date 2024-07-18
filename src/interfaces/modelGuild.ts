export interface IModelGuild {
  name: string;
  guildId: string;
  premium: boolean;
  prefix: string;
  pedirsetChannelId?: string;
  aprovarsetChannelId?: string;
  recrutamentoCategory?: string;
  entryRoleId?: string;
  entryRoleRemove?: string;
}