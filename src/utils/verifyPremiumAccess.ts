import { CommandInteraction } from "discord.js";
import { logger } from "..";
import { createEmbed } from "./createEmbed";
import { getGuild } from "./getGuild";

export async function verifyPremiumAccess(interaction: CommandInteraction) {
  const isDeferred = interaction.deferred;
  const guild = interaction.guild!;
  const user = interaction.user;
  return new Promise(async (resolve, reject) => {
    try {
      if (isDeferred) {
        await interaction.editReply({
          content: "Verificando acesso Premium do servidor...",
        });
      }
      const guildDb = await getGuild(interaction.guildId!);
      if (!guildDb) throw new Error("Guild not found");

      if (guildDb.premium) {
        logger.info("Premium Access", 5, guild);
        resolve(true);
      } else {
        if (isDeferred) {
          const title = "Este servidor não possui Premium.";
          const description =
            "Para utilizar este comando, o servidor precisa possuir a assinatura Premium.\n\nPara ativar sua Assinatura Premium entre em contato com @kaworii21.";

          const embed = await createEmbed(guild, title, description, true, true, true);

          await interaction.editReply({ content: "", embeds: [embed!] });
        }

        logger.warn("Server does not have premium access", 5, __filename, guild, user);
        reject("Server does not have premium access");
      }
    } catch (error) {
      const msg = "Failed to verify premium access";
      logger.error(msg, error, 5, __filename, guild, user);

      if (isDeferred) await interaction.editReply({ content: msg });

      reject(error);
    }
  });
}
