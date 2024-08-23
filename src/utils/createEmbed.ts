import { EmbedBuilder, EmbedFooterOptions, Guild } from "discord.js";
import { logger } from "..";
import { getGuild } from "./getGuild";

export function createEmbed(  
  guild: Guild,
  title?: string,
  description?: string,
  footer?: EmbedFooterOptions | boolean,
  thumbnail?: string | boolean,
  timestamp?: boolean,
  color?: string,
): Promise<EmbedBuilder> {
  return new Promise(async (resolve, reject) => {
    try {
      const guildDb = await getGuild(guild.id);
      if (!guildDb) return null;

      const embed = new EmbedBuilder();

      setTitle(embed, title);
      setDescription(embed, description);
      setFooter(embed, guild, footer);
      setTimestamp(embed, timestamp);
      setThumbnail(embed, thumbnail, guild);
      setColor(embed, color, guildDb);

      resolve(embed);
    } catch (error) {
      logger.error("error creating embed", error, 5, __filename);
      reject(error);
    }
  });
}

function setTitle(embed: EmbedBuilder, title: string | undefined) {
  return embed.setTitle(typeof title === "string" && title ? title : null);
}

function setDescription(embed: EmbedBuilder, description: string | undefined) {
  return embed.setDescription(
    typeof description === "string" && description ? description : null
  );
}

function setFooter(
  embed: EmbedBuilder,
  guild: Guild,
  footer: EmbedFooterOptions | boolean | undefined
) {
  return embed.setFooter(
    typeof footer === "boolean" && footer
      ? { text: `${guild.name}`, iconURL: guild.iconURL() ?? undefined }
      : typeof footer === "object"
      ? footer
      : null
  );
}

function setTimestamp(
  embed: EmbedBuilder,
  timestamp: boolean | null | undefined
): EmbedBuilder {
  if (timestamp) {
    embed.setTimestamp(Date.now());
  }
  return embed;
}

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

function setColor(embed: EmbedBuilder, color: string | null | undefined, guildDb: any) {
  embed.setColor(
    typeof color === "string" && color
      ? parseInt(color, 16)
      : parseInt(guildDb.embedColor || "000000", 16)
  );
}
