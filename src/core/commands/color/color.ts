import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import { createEmbed } from "../../../utils/createEmbed";
import { logger } from "../../..";
import { database } from "../../services/database/database.service";
import { verifyPremiumAccess } from "../../services/verify-premium-access/verifyPremiumAccess";
import { verifyPermission } from "../../services/verify-permission/verifyPermission";

export const data = new SlashCommandBuilder()
  .setName("color")
  .setDescription("O comando permite definir a cor das embeds do servidor.")
  .addStringOption(
    new SlashCommandStringOption()
      .setName("hexadecimal")
      .setDescription(
        "Você pode usar qualquer cor hexadecimal válida (ex: #FF0000 para vermelho)"
      )
      .setMaxLength(6)
      .setMinLength(6)
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  try {
    await interaction.deferReply({ ephemeral: true });
    if (
      !(await verifyPremiumAccess(interaction)) ||
      !(await verifyPermission(interaction, "Administrator"))
    )
      return;

    const valor = await interaction.options
      .get("hexadecimal")
      ?.value?.toLocaleString()
      .toUpperCase();

    if (!valor || !/[0-9A-F]{6}$/i.test(valor)) {
      interaction.editReply({
        content: "A cor deve ser um hexadecimal válido (ex: FF0000)",
      });
      throw new Error("Color valor invalid");
    }

    const guildDb = await database.getGuild(interaction.guildId!);
    if (!guildDb) throw new Error("Guild not found in database");

    guildDb.embedColor = valor;
    guildDb.save();

    const embed = await createEmbed(
      interaction.guild!,
      "Cor adicionada com sucesso!",
      `Esta será a nova cor das embeds.\n\`#${valor}\``,
      true
    );

    await interaction.editReply({ content: "", embeds: [embed!] });
  } catch (error) {
    const msg = `Error executing ${interaction.commandName} command`;
    const user = interaction.user;
    logger.error(msg, error, 3, __filename, interaction.guild!, user);

    await interaction.editReply({
      content: `Error executing ${interaction.commandName} command`,
    });
  }
}
