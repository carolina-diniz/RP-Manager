import { Message, PartialMessage } from "discord.js";
import { logger } from "../..";
import { ModelSales } from "../models/modelSales";
import { database } from "../services/database/database.service";


export async function onMessageDelete(message: Message | PartialMessage) {
  logger.init({filePath: __filename});
  try {
    if (!message) return;

    const guildDb = await database.getGuild(message.guildId!);

    if (!guildDb?.reportSalesId || guildDb.reportSalesId != message.channelId) return;
    
    await ModelSales.deleteOne({ messageId: message.id })
  } catch (error) {
    logger.error("Error ao deletar messagem", error, 5, __filename, message.guild!);
  }
}
