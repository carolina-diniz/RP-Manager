import { ButtonInteraction } from "discord.js";
import { logger } from "../../..";

export async function execute(interaction: ButtonInteraction) {
  try {
    logger.init({ filePath: __filename });
    const message = await interaction.message;
    await message.delete();
  } catch (error) {
    logger.error("Error executing command", error, 5, __filename);
    await interaction.editReply({ content: "Ocorreu um erro ao executar o comando." });
  }
}
