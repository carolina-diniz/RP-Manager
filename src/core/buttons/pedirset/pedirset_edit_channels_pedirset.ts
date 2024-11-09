import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { logger } from "../../..";

export async function execute(interaction: ButtonInteraction) {
  try {
    logger.init({ filePath: __filename });

    const modal = new ModalBuilder()
      .setCustomId("modal_pedirset_edit_channels_pedirset")
      .setTitle("Editar Pedir Set");

    const setID = new TextInputBuilder()
      .setCustomId("pedirset_edit_channels_pedirset_setID")
      .setLabel("ID do canal")
      .setPlaceholder("Digite o ID do canal")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMinLength(1);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(setID);

    await interaction.showModal(modal.addComponents(row));
  } catch (error) {
    logger.error("Error executing command", error, 5, __filename);
    await interaction.reply({ content: "Ocorreu um erro ao executar o comando." });
  }
}
