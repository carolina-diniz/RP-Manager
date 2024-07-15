import { ActivityType, Client } from "discord.js";
import { database } from "../../database/database";
import { logger } from "../../util/logger";

export async function onReady(client: Client) {
  try {
    logger.info(`Bot online! Name: ${client.user!.username}, ID: ${client.user!.id}`)

    const activityName: string = "GTA RP"

    await client.user!.setPresence({
      activities: [{ name: activityName, type: ActivityType.Playing}]
    })
    logger.updated(`Activity setted to: ${activityName}`)

    database()

  } catch (error) {
    logger.error(__dirname, error)
  }
}