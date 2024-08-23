import { Message } from "discord.js";
import { logger } from "..";
import { relatorioVendaMessage } from "../messages/relatorioVenda/relatorio-venda";
import { getGuild } from "../utils/getGuild";

export async function onMessageCreate(message: Message) {
  if (message.channelId === "1275590381337051136") return;
  try {
    if (message.author.bot) return;
    logger.init(__filename, 6, message.guild!)

    //await verifyLinks(message)

    const guildDb = await getGuild(message.guildId!)
    
    if (message.channelId === guildDb?.reportSalesId) {
      await relatorioVendaMessage(message)
    }
  } catch (error) {
    logger.error('Error executing onMessageCreate', error, 5, __filename)
  }
}