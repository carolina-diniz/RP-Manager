import { TextInputBuilder } from "@discordjs/builders";
import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputStyle,
} from "discord.js";
import { logger } from "../..";
import {
  textInputBuilderQuantity,
  textInputBuilderReason
} from "./relatorio_textInputBuilder";

export async function execute(interaction: ButtonInteraction) {
  logger.init({filePath: __filename});
  try {
    const modal = new ModalBuilder()
      .setCustomId("relatorio_coletes")
      .setTitle("Relatório de Coletes");

    const quantity: any = new ActionRowBuilder<TextInputBuilder>().addComponents(
      textInputBuilderQuantity
    );
    const member: any = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId("member")
        .setLabel("ID do Membro (Não obrigatório):")
        .setStyle(TextInputStyle.Short)
        .setMinLength(2)
        .setMaxLength(20)
        .setRequired(false)
    );
    const reason: any = new ActionRowBuilder<TextInputBuilder>().addComponents(
      textInputBuilderReason
    );

    modal.addComponents(quantity, member, reason);
    await interaction.showModal(modal);
  } catch (error) {
    logger.error("Error executing button", error, 5, __filename);
  }
}
