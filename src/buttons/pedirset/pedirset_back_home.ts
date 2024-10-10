import { ButtonInteraction } from "discord.js";
import { logger } from "../..";
import { createButtonsHome, createEmbedHome } from "../../commands/pedirset/pedirset";

export async function execute(interaction: ButtonInteraction) {
  try {
    logger.init({ filePath: __filename });
    const embed = await createEmbedHome(interaction);
    const buttons = await createButtonsHome();
    await interaction.update({ embeds: [embed], components: [buttons] });
  } catch (error) {
    logger.error("Error executing command", error, 5, __filename);
    await interaction.editReply({ content: "Ocorreu um erro ao executar o comando." });
  }
}
