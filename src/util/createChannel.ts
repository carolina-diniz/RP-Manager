import { ChannelType, Guild, OverwriteResolvable, TextChannel } from "discord.js";
import { logger } from "../events/on-InteractionCreate/onInteractionCreate";

interface IParameter {
  guild: Guild;
  name: string;
  permission: OverwriteResolvable[];
  category?: string | null;
}

export async function createChannel(data: IParameter): Promise<TextChannel | null> {
  const { guild, name, permission, category } = data;
  logger.setGuildName(guild.name);

  try {
    logger.system.info(`Criando canal ${name}...`);
    const channel: TextChannel = await guild!.channels.create({
      name,
      nsfw: false,
      type: ChannelType.GuildText,
      permissionOverwrites: permission,
      parent: category,
    });

    if (!channel) throw new Error("Error creating channel");

    logger.system.info(`Canal ${name} criado com sucesso!`);
    return channel;
  } catch (error) {
    logger.system.error(`Erro ao criar canal ${name}`, error);
    return null;
  }
}
