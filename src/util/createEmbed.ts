import { EmbedBuilder, EmbedFooterOptions } from "@discordjs/builders";
import { Guild } from "discord.js";
import { ModelGuild } from "../models/modelGuild";
import { logger } from "../util/logger";

interface IEmbedBuilder {
  title?: string | null;
  guild: Guild;
  description?: string | null;
  footer?: EmbedFooterOptions | boolean | null;
  timestamp?: boolean | null;
  thumbnail?: string | boolean | null;
  color?: string | null;
}

export async function createEmbed(
  data: IEmbedBuilder
): Promise<EmbedBuilder | null | undefined> {
  try {
    if (!data.guild) return;

    const dbGuild = await ModelGuild.findOne({ guildId: data.guild.id }).catch((error) => {
      logger.error(__filename, error);
      return null;
    });
    if (!dbGuild) return null;

    // create embed with given parameters and return it
    const embed = new EmbedBuilder();

    setTitle(embed, data.title);
    setDescription(embed, data.description);
    setFooter(embed, data.guild, data.footer);
    setTimestamp(embed, data.timestamp);
    setThumbnail(embed, data.thumbnail, data.guild);
    setColor(embed, data.color, dbGuild);

    return embed;
  } catch (error) {
    logger.error(__filename, error);
    return null;
  }
}

function setTitle(embed: EmbedBuilder, title: string | null | undefined) {
  return embed.setTitle(typeof title === "string" && title ? title : null);
}

function setDescription(embed: EmbedBuilder, description: string | null | undefined) {
  return embed.setDescription(
    typeof description === "string" && description ? description : null
  );
}

// Função auxiliar para configurar o footer do embed
function setFooter(
  embed: EmbedBuilder,
  guild: Guild,
  footer: EmbedFooterOptions | boolean | null | undefined
) {
  return embed.setFooter(
    typeof footer === "boolean" && footer
      ? { text: `${guild.name}`,iconURL: guild.iconURL() ?? undefined }
      : typeof footer === "object"
      ? footer
      : null
  );
}

// Função auxiliar para configurar o timestamp do embed
function setTimestamp(
  embed: EmbedBuilder,
  timestamp: boolean | null | undefined
): EmbedBuilder {
  if (timestamp) {
    embed.setTimestamp(Date.now());
  }
  return embed;
}

// Função auxiliar para configurar a thumbnail do embed
function setThumbnail(
  embed: EmbedBuilder,
  thumbnail: string | boolean | null | undefined,
  guild: Guild
): EmbedBuilder {
  return embed.setThumbnail(
    typeof thumbnail === "string" && thumbnail
      ? thumbnail
      : typeof thumbnail === "boolean" && thumbnail
      ? guild.iconURL()
      : null
  );
}

function setColor(embed: EmbedBuilder, color: string | null | undefined, dbGuild: any) {
  embed.setColor(
    typeof color === "string" && color
      ? parseInt(color, 16)
      : parseInt(dbGuild.embedColor || "000000", 16)
  );
}
