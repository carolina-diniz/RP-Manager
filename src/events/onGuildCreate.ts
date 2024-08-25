import { Guild } from "discord.js";
import { client, logger } from "..";
import { deployCommands } from "../deployCommands";
import { ModelGuild } from "../models/modelGuild";
import { getGuild } from "../utils/getGuild";

export async function onGuildCreate(guild: Guild) {
  try {
    const guildDb = await getGuild(guild.id);
    if (!guildDb) await createGuildDb(guild);

    logger.info(`GUILD CONNECTED: ${guild.name}`);

    await deployCommands({ guildId: guild!.id, clientId: client.user!.id });
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
