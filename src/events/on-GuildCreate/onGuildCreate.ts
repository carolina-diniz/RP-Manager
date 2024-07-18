import { Client, Guild } from "discord.js";
import { deployCommands } from "../../deploy-commands";
import { ModelGuild } from "../../models/modelGuild";
import { logger } from "../../util/logger";

export async function onGuildCreate(guild: Guild, client: Client) {
  try {
    if (!guild) throw new Error("Guild not available");
    logger.info(`Conectado ao servidor: "${guild.name}", ID: ${guild.id}`);

    // Deploy commands to the guild
    await deployCommands({
      guildId: guild.id,
      clientId: client.user!.id,
    });

    // Get the guild from database
    const dbGuild = await ModelGuild.findOne({ guildId: guild.id }).catch(() => null);

    // If guild is not in the database, add it and save it to the database
    if (dbGuild) {
      logger.database.info(`Guild "${guild.name}" already exists on the database`)
    } else {
      const newGuild = new ModelGuild({
        name: guild.name,
        guildId: guild.id,
        premium: false,
        prefix: '[N]',
      });
      newGuild.save();
      logger.database.create(`Novo servidor adicionado: ${guild.name}, ID: ${guild.id}`);
    }
  } catch (error) {
    logger.error(__filename, error);
  }
}