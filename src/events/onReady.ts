import { ActivityType } from "discord.js";
import { client, logger } from "..";

export function onReady() {
  logger.info(`BOT: ${client.user!.username} connected`, 5)
  try {
    const activityName = "FiveM | GTA RP";

    client.user!.setActivity({
      name: activityName,
      type: ActivityType.Playing,
    });

    logger.info(`Activity set to ${activityName}`, 5)
  } catch (error) {
    logger.error('failed to set activity', error, 5, __filename)
  }
}
