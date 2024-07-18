import { Client, Guild } from "discord.js";
import { ModelGuild } from "../../models/modelGuild";
import { logger } from "../../util/logger";

export async function onGuildDelete(guild: Guild, client: Client) {
  try {
    await ModelGuild.deleteOne({guildId: guild.id})
    logger.database.delete(`Guild deleted successfully \nGuildId: ${guild.id}\nGuild Name: ${guild.name}`)
  } catch (error) {
    logger.error(__filename, error)
  }
}