import { Guild } from "discord.js";
import { logger } from "./logger";

export async function getTarget(guild: Guild, targetString: string) {
  try {
    const targetId = targetString
    .replace("||<@", "")
    .replace(">||", "");

    const target = guild.members.resolve(targetId)

    logger.info(`Got target: ${target?.nickname}`)
    return target;
  } catch (error) {
    logger.error(__filename, error)
    return null
  }
}