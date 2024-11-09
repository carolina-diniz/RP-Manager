import { CommandInteraction, Guild } from "discord.js";
import { editInteractionReply } from "../../../utils/editInteractionReply";
import { database } from "../database/database.service";
import { logger } from "../../..";
import { createEmbed } from "../../../utils/createEmbed";


export async function verifyPremiumAccess(
  interaction: CommandInteraction
): Promise<boolean> {
  logger.init({filePath: __filename});

  const guild = interaction.guild!;
  const user = interaction.user;
  const isDeferred = interaction.deferred;

  return new Promise(async (resolve, reject) => {
    try {
      await editInteractionReply(interaction, isDeferred, "Verificando acesso Premium do servidor...");

      const guildDb = await database.getGuild(interaction.guildId!);
      if (!guildDb) throw new Error("Guild not found");

      if (guildDb.premium) {
        await verifyExpiration(interaction, isDeferred, guild);
        resolve(true);
      } else {
        if (isDeferred) {
          await replyMessage(guild, interaction);
        }
        logger.warn("Server does not have premium access", 5, __filename, guild, user);
        reject("Server does not have premium access");
      }
    } catch (error) {
      logger.error("Failed to verify premium access", error, 5, __filename, guild, user);
      await editInteractionReply(interaction, isDeferred, "Failed to verify premium access");
      reject(error);
    }
  });
}

async function verifyExpiration(
  interaction: CommandInteraction,
  isDeferred: boolean,
  guild: Guild
): Promise<void> {
  const guildDb = await database.getGuild(interaction.guildId!);
  if (!guildDb) throw new Error("Guild not found");

  const { payment } = guildDb;
  const dateNow = new Date();
  const dateExpiration = new Date(payment.expiration!);

  console.log(dateNow)
  console.log(dateExpiration)

  if (dateExpiration && dateNow.getTime() > dateExpiration.getTime()) {
    await editInteractionReply(interaction, isDeferred, "O acesso Premium do servidor expirou.");
    guildDb.premium = false;
    await guildDb.save();
    logger.warn("Premium access expired", 5, __filename, guild);
  }
}



async function replyMessage(guild: Guild, interaction: CommandInteraction) {
  const TITLE = "Este servidor não possui Premium.";
  const DESCRIPTION =
    "Para utilizar este comando, é necessário que o servidor possua a assinatura Premium.\n\n" +
    "Ative sua Assinatura Premium usando o comando `/premium`.\n\n" +
    "Para mais informações, consulte o [RP Manager](https://discord.gg/cPYavJAFrY)";

  try {
    const embed = await createEmbed(guild, TITLE, DESCRIPTION, true, true, true);
    await interaction.editReply({ content: "", embeds: [embed!] });
  } catch (error) {
    console.error("Error ao criar ou editar o embed:", error);
    await interaction.editReply({
      content: "Ocorreu um erro ao processar sua solicitação.",
    });
  }
}
