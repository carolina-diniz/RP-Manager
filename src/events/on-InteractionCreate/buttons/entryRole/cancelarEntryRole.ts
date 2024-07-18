import { ButtonInteraction } from "discord.js";
import { createEmbed } from "../../../../util/createEmbed";
import { logger } from "../../../../util/logger";

export async function execute(interaction: ButtonInteraction) {
  try {

    const embed = await createEmbed({
      guild: interaction.guild!,
      title: 'Cancelado!'
    })
    interaction.update({
      content: '',
      components: [],
      embeds: [embed!]
    });
  } catch (error) {
    logger.error(__filename, error)
  }
}