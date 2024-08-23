import {
  ActionRowBuilder,
  CommandInteraction,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { logger } from "../..";
import { verifyPermission } from "../../utils/verifyPermission";
import { verifyPremiumAccess } from "../../utils/verifyPremiumAccess";

export const data = new SlashCommandBuilder().setName("ticket").setDescription("ticket");

export async function execute(interaction: CommandInteraction) {
  try {
    if (
      !(await verifyPremiumAccess(interaction)) ||
      !(await verifyPermission(interaction, "Administrator"))
    )
      return null;
    
    throw new Error("Command does not exist")

    const title = new TextInputBuilder()
      .setCustomId("ticket_titleInput")
      .setLabel("Título")
      .setRequired(true)
      .setMaxLength(25)
      .setStyle(TextInputStyle.Short);

    const description: TextInputBuilder = new TextInputBuilder()
      .setCustomId("ticket_descriptionInput")
      .setLabel("Descrição")
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);

    const buttonName: TextInputBuilder = new TextInputBuilder()
      .setCustomId("ticket_buttonNameInput")
      .setLabel("Nome do Botão")
      .setRequired(true)
      .setMaxLength(15)
      .setStyle(TextInputStyle.Short);

    const ln1: any = new ActionRowBuilder().addComponents(title);
    const ln2: any = new ActionRowBuilder().addComponents(description);
    const ln3: any = new ActionRowBuilder().addComponents(buttonName);

    const modal = new ModalBuilder()
      .setCustomId("ticket")
      .setTitle("CRIAR BOTÃO DE TICKET")
      .addComponents(ln1, ln2, ln3);

    await interaction.showModal(modal);
  } catch (error) {
    const msg = `Error executing ${interaction.commandName} command`;
    const user = interaction.user;
    logger.error(msg, error, 3, __filename, interaction.guild!, user);

    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply({
      content: `Error executing ${interaction.commandName} command`,
    });
  }
}
