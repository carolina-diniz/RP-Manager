import { Guild } from "discord.js";
import { logger } from "../..";
import * as config from "../../../config.json";
import { client } from "../../connections/discord.connection";
import { ModelGuild } from "../models/modelGuild";
import { deployCommands } from "../services/deploy-commands/deployCommands";
import { database } from "../services/database/database.service";

export async function onGuildAvailable(guild: Guild) {
  try {
    const guildDb = await database.getGuild(guild.id);
    if (!guildDb) await createGuildDb(guild);

    logger.info(`GUILD CONNECTED: ${guild.name}`);

    if (config.autodeploy) {
      await deployCommands(guild!.id, client.user!.id);
    }
  } catch (error) {
    logger.error("Error getting guild", error, 5, __filename);
  }
}

function createGuildDb(guild: Guild) {
  return new Promise((resolve, reject) => {
    try {
      const guildDb = new ModelGuild({
        name: guild.name,
        guildId: guild.id,
        premium: false,
        payment: {
          lastPayment: null,
          expiration: null,
        },
        prefix: "[N]",
      });
      guildDb.save();
      logger.info("Guild saved to database", 2);
      resolve(guildDb);
    } catch (error) {
      logger.error("Error creating guild", error, 2, __filename);
      reject(error);
    }
  });
}
