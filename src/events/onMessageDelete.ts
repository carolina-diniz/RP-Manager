import { Message, PartialMessage } from "discord.js";
import { logger } from "..";
import { ModelSales } from "../models/modelSales";
import { getGuild } from "../utils/getGuild";

export async function onMessageDelete(message: Message | PartialMessage) {
  logger.init(__filename, 6, message.guild!);
  try {
    if (!message) return;

    const guildDb = await getGuild(message.guildId!);

    if (!guildDb?.reportSalesId || guildDb.reportSalesId != message.channelId) return;
    
    await ModelSales.deleteOne({ messageId: message.id })
  } catch (error) {
    logger.error("Error ao deletar messagem", error, 5, __filename, message.guild!);
  }
}
