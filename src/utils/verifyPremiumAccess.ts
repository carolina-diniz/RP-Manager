import { CommandInteraction, Guild } from "discord.js";
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
        const dateNow = new Date();

        if (guildDb.payment.expiration) {
          const dateExpiration = new Date(guildDb.payment.expiration);

          // verifica se acesso premium do servidor expirou
          if (dateNow.getTime() > dateExpiration.getTime()) {
            if (isDeferred) {
              await replyMessage(guild, interaction);
            }
            guildDb.premium = false;
            await guildDb.save()
            
            logger.warn("Premium access expired", 5, __filename, guild, user);
            reject("Premium access expired");
          }
        }
        
        logger.info("Premium Access", 5, guild);

        resolve(true);
      } else {
        if (isDeferred) {
          await replyMessage(guild, interaction);
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

async function replyMessage(guild: Guild, interaction: CommandInteraction) {
  const title = "Este servidor não possui Premium.";
  const description =
    "Para utilizar este comando, é necessário que o servidor possua a assinatura Premium.\n\nAtive sua Assinatura Premium usando o comando ` /premium `.\n\n Para mais informações, consulte o [RP Manager](https://discord.gg/cPYavJAFrY)";

  const embed = await createEmbed(guild, title, description, true, true, true);

  await interaction.editReply({ content: "", embeds: [embed!] });
}
