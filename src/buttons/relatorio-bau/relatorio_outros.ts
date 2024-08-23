import { TextInputBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonInteraction, ModalBuilder } from "discord.js";
import { logger } from "../..";
import {
  textInputBuilderItem,
  textInputBuilderMember,
  textInputBuilderQuantity,
  textInputBuilderReason,
} from "./relatorio_textInputBuilder";

export async function execute(interaction: ButtonInteraction) {
  logger.init(__filename);
  try {
    const modal = new ModalBuilder()
      .setCustomId("relatorio_outros")
      .setTitle("Relatório de Outros Items");

    const item: any = new ActionRowBuilder<TextInputBuilder>().addComponents(
      textInputBuilderItem
    );
    const quantity: any = new ActionRowBuilder<TextInputBuilder>().addComponents(
      textInputBuilderQuantity
    );
    const member: any = new ActionRowBuilder<TextInputBuilder>().addComponents(
      textInputBuilderMember
    );
    const reason: any = new ActionRowBuilder<TextInputBuilder>().addComponents(
      textInputBuilderReason
    );

    modal.addComponents(item, quantity, member, reason);
    await interaction.showModal(modal);
  } catch (error) {
    logger.error("Error executing button", error, 5, __filename);
  }
}
