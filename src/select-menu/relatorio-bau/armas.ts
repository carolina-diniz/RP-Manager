import {
  ActionRowBuilder,
  ModalBuilder,
  StringSelectMenuInteraction,
  TextInputBuilder
} from "discord.js";
import { logger } from "../..";
import {
  textInputBuilderMember,
  textInputBuilderQuantity,
  textInputBuilderReason,
} from "../../buttons/relatorio-bau/relatorio_textInputBuilder";
import { cache } from "../../cache/interaction";
import { gunNames } from "../../json/gunsNames";

export async function execute(interaction: StringSelectMenuInteraction) {
  logger.init({filePath: __filename});
  try {
    const modal = new ModalBuilder()
      .setCustomId("relatorio_armas")
      .setTitle(
        `Relatório de Armas [${gunNames[interaction.values[0] as keyof typeof gunNames]}]`
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

    cache[interaction.user.id].relatorio_bau.selectedWeapon = interaction.values[0]

    modal.addComponents(quantity, member, reason);
    await interaction.showModal(modal);
  } catch (error) {
    logger.error("Error executing select menu", error, 5, __filename);
  }
}
