import { Message } from "discord.js";
import { logger } from "../..";
import { database } from "../services/database/database.service";

export async function onMessageCreate(message: Message) {
  if (message.channelId === "1275590381337051136") return;
  try {
    if (message.author.bot) return;
    logger.init({filePath: __filename})

  } catch (error) {
    logger.error('Error executing onMessageCreate', error, 5, __filename)
  }
}