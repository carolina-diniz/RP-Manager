import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuInteraction,
} from "discord.js";
import { createEmbed } from "../../../../util/createEmbed";
import { logger } from "../../../../util/logger";

export async function execute(interaction: StringSelectMenuInteraction) {
  try {
    const role = await interaction.guild!.roles.fetch(interaction.values[0]);

    const embed = await createEmbed({
      guild: interaction.guild!,
      title: `Confirmação`,
      description: `Você está prestes a definir o cargo **"${
        role!.name
      }"** como o cargo de entrada. 
Todos os novos membros receberão este cargo ao aprovar o set.\n\n
Deseja continuar?`,
      footer: { text: `roleId: ${interaction.values[0]}` },
    });

    const confirmar = new ButtonBuilder()
      .setCustomId("confirmarEntryRole")
      .setLabel("Confirmar")
      .setStyle(ButtonStyle.Success)
      .setEmoji({
        name: "✔️",
      });

    const cancelar = new ButtonBuilder()
      .setCustomId("cancelarEntryRole")
      .setLabel("Cancelar")
      .setStyle(ButtonStyle.Danger)
      .setEmoji({
        name: "✖️",
      });

    const row: any = new ActionRowBuilder().addComponents(confirmar, cancelar);

    await interaction.update({
      embeds: [embed!],
      components: [row],
    });
  } catch (error) {
    logger.error(__filename, error);
  }
}
