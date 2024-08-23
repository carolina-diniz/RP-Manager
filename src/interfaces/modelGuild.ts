export interface IModelGuild {
  guildId: string;
  name: string;
  premium: boolean;
  prefix: string;
  embedColor?: string;
  pdChannelId?: string;
  recruitmentCategoryId?: string;
  pedirsetChannelId?: string;
  aprovarsetChannelId?: string;
  entryRoleId?: {id: string, name: string}[];
  entryRoleRemoveId?: {id: string, name: string}[];
  reportSalesId?: string;
  reportSalesRolesId?: {id: string, percent: number}[];
  reportChestId?: string;
  reportButtonChestId?: string;
  hierarquiaMessageId?: string;
}