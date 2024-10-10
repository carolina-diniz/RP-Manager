import { CommandInteraction } from "discord.js";

export async function editInteractionReply(interaction: CommandInteraction, isDeferred: boolean, content: string) {
  if (isDeferred) {
    await interaction.editReply({ content });
  } else {
    await interaction.followUp({ content });
  }
}