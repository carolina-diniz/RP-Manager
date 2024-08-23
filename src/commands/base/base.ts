import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { logger } from "../..";

export const data = new SlashCommandBuilder()
.setName('')
.setDescription('')

export async function execute(interaction: CommandInteraction) {
  try {
    
  } catch (error) {
    const msg = `Error executing ${interaction.commandName} command`;
    const user = interaction.user
    logger.error(msg, error, 3, __filename, interaction.guild!, user);

    await interaction.editReply({
      content: `Error executing ${interaction.commandName} command`,
    });
  }
}