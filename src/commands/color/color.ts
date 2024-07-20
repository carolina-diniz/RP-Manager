import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import { logger } from "../../events/on-InteractionCreate/onInteractionCreate";
import { getDbGuild } from "../../util/getDbGuild";
import { verifyPermissions } from "../../util/verifyPermissions";
import { verifyPremiumAccess } from "../../util/verifyPremiumAccess";

export const data = new SlashCommandBuilder()
  .setName("color")
  .setDescription("cor das embeds")
  .addStringOption(
    new SlashCommandStringOption()
      .setName("hex")
      .setDescription("cor das embeds em hexadecimal")
      .setMaxLength(6)
      .setMinLength(6)
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  try {
    const isAdmin = await verifyPermissions(interaction, 'Administrator')
    if (!isAdmin) throw new Error('Usuário não possui permissão para usar este comando!')

    const isPremium = await verifyPremiumAccess(interaction)
    if (!isPremium) throw new Error('Este servidor não possui premium!')

    const valor = await interaction.options.get("hex")?.value?.toLocaleString();
    if (!valor || !/[0-9A-F]{6}$/i.test(valor)) {
      interaction.reply({
        content: "A cor deve ser um hexadecimal válido (ex: FF0000)",
        ephemeral: true,
      });
      throw new Error("Valor inválido");
    }

    const dbGuild = await getDbGuild(interaction)
    if (!dbGuild) throw new Error("Guild não encontrada no banco de dados");

    dbGuild.embedColor = valor
    await dbGuild.save();

    logger.database.info('color add to guild', 'guild')

    interaction.reply({
      content: `Cor ${valor} adicionada com sucesso!`,
      ephemeral: true,
    })

  } catch (error) {
    logger.command.error("", error);
  }
}
