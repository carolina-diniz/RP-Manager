import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { client } from "../../../connections/discord.connection";
import { createEmbed } from "../../../utils/createEmbed";

export const data = new SlashCommandBuilder()
  .setName("uptime")
  .setDescription(
    "Mostra o status atual do bot e o tempo de atividade desde a última vez que ele foi reiniciado."
  );

export async function execute(interaction: CommandInteraction) {
  try {
    await interaction.deferReply({ ephemeral: true });

    const UPTIME = process.uptime();
    const TITLE = client.user?.username;
    const DESCRIPTION =
      "**Status**: ` Online ✅ `\n" + `**Uptime:** <t:${Math.floor(Date.now() / 1000 - UPTIME)}:R>`;

    const embed = await createEmbed(interaction.guild!, TITLE, DESCRIPTION);

    await interaction.editReply({ content: "", embeds: [embed!] });
    
    console.log(`command ${interaction.commandName} replyed successfully`);
  } catch (error) {
    console.log(`Error executing ${interaction.commandName} command`);

    await interaction.editReply({
      content: `Error executing ${interaction.commandName} command`,
    });
  }
}
