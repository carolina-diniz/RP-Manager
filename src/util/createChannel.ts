import { ChannelType, Guild, TextChannel } from "discord.js";
import { logger } from "./logger";

interface IParameter {
  guild: Guild;
  name: string;
  permission: any[];
  category?: string | null;
}

export async function createChannel(data: IParameter): Promise<TextChannel | null> {
  const { guild, name, permission, category } = data;

  try {
    const channel: TextChannel = await guild!.channels.create({
      name,
      nsfw: false,
      type: ChannelType.GuildText,
      permissionOverwrites: permission,
      parent: category
    });

    if (!channel) throw new Error("Error creating channel");
    return channel;
  } catch (error) {
    logger.error(__filename, error);
    return null;
  }
}
