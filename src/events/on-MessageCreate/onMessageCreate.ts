import { Message } from "discord.js";
import { Logger } from "../../classes/logger";
import { ModelGuild } from "../../models/modelGuild";
import { salesReport } from "./sales-report/salesReport";
export const logger = new Logger(__filename);
export async function onMessageCreate(message: Message) {
  logger.setUserName(message.author.displayName)
  logger.setGuildName(message.guild!.name)
  try {
    if (message.author.bot) return;

    const dbGuild = await ModelGuild.findOne({guildId: message.guildId})
    if (!dbGuild) return;

    if (message.channelId === dbGuild.salesReportChannelId) {
      await salesReport(message)
    }
  } catch (error) {}
}
