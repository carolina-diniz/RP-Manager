import { DMChannel, NonThreadGuildBasedChannel } from "discord.js";
import { logger } from "..";
import { getGuild } from "../utils/getGuild";

export async function onChannelDelete(channel: DMChannel | NonThreadGuildBasedChannel) {
  logger.init(__filename, 5);
  if (
    !channel.isTextBased() ||
    channel.isDMBased() ||
    channel.isThread() ||
    channel.isVoiceBased()
  )
    return;

  try {
    const guildDb = await getGuild(channel.guildId);
    if (!guildDb) return;

    if (guildDb.pdChannelId === channel.id) {
      await guildDb.updateOne({ pdChannelId: "" });
      logger.info(`Removed ${channel.name} channel for guild ${channel.guild.name}`, 5);
    }

    if (guildDb.aprovarsetChannelId === channel.id) {
      await guildDb.updateOne({ aprovarsetChannelId: "" });
      logger.info(`Removed ${channel.name} channel for guild ${channel.guild.name}`, 5);
    }

    if (guildDb.pedirsetChannelId === channel.id) {
      await guildDb.updateOne({ pedirsetChannelId: "" });
      await guildDb.updateOne({ recruitmentCategoryId: "" });
      logger.info(`Removed ${channel.name} channel for guild ${channel.guild.name}`, 5);
    }

    if (guildDb.reportButtonChestId === channel.id) {
      await guildDb.updateOne({ reportButtonChestId: "" });
      logger.info(`Removed ${channel.name} channel for guild ${channel.guild.name}`, 5);
    }

    if (guildDb.reportChestId === channel.id) {
      await guildDb.updateOne({ reportChestId: "" });
      logger.info(`Removed ${channel.name} channel for guild ${channel.guild.name}`, 5);
    }

    if (guildDb.reportSalesId === channel.id) {
      await guildDb.updateOne({ reportSalesId: "" });
      logger.info(`Removed ${channel.name} channel for guild ${channel.guild.name}`, 5);
    }
  } catch (error) {
    logger.error("Error onChannelDelete", error, 5, __filename);
  }
}
