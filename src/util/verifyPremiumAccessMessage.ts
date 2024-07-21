import { Message } from "discord.js";
import { Logger } from "../classes/logger";
import { ModelGuild } from "../models/modelGuild";
import { createEmbed } from "./createEmbed";
const logger = new Logger(__filename);

export async function verifyPremiumAccessMessage(message: Message) {
  logger.setGuildName(message.guild!.name);
  try {
    const dbGuild = await ModelGuild.findOne({ guildId: message.guild!.id });
    if (!dbGuild) throw new Error("Could not find guild");

    if (dbGuild.premium) {
      logger.system.info("Premium access");
      return true;
    } else {
      logger.system.info("No Premium access");

      const embed = await createEmbed({
        guild: message.guild!,
        title: "Este servidor não possui Premium.",
        description:
          "Para acessar este comando, o servidor precisa possuir a assinatura Premium.\n\nAssinatura Premium está disponível em breve.",
        timestamp: true,
        footer: true,
        thumbnail: "https://media.tenor.com/RY9NX67klacAAAAi/sad-cute.gif",
      });

      await message.reply({ content: "", embeds: [embed!] });
      return false;
    }
  } catch (error) {
    logger.system.error(`falha ao verificar preminum access`, error);
  }
}
