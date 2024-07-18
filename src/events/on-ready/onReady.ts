import { ActivityType, Client } from "discord.js";
import { database } from "../../database/database";
import { logger } from "../../util/logger";

export async function onReady(client: Client) {
  try {
    // Check if bot is already online
    if(!client) throw new Error('Client is not online');
    logger.info(`Bot online! Name: ${client.user!.username}, ID: ${client.user!.id}`)

    // Set bot's activity to playing GTA RP
    const activityName: string = "GTA RP"
    await client.user!.setPresence({
      activities: [{ name: activityName, type: ActivityType.Playing}]
    })
    logger.updated(`Activity setted to: ${activityName}`)

    // Start database connection
    database()
  } catch (error) {
    logger.error(__filename, error)
  }
}