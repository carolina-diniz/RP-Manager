import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { client, logger } from "../..";
import { createEmbed } from "../../utils/createEmbed";

export const data = new SlashCommandBuilder()
  .setName("uptime")
  .setDescription(
    "Mostra o status atual do bot e o tempo de atividade desde a última vez que ele foi reiniciado."
  );

export async function execute(interaction: CommandInteraction) {
  logger.init(__filename, 3, interaction.guild!)
  try {
    await interaction.deferReply({ ephemeral: true });

    const uptime = process.uptime();
    const title = client.user!.username;
    let description = "**Status**: ` Online ✅ `\n";
    description += `**Uptime:** <t:${Math.floor(Date.now() / 1000 - uptime)}:R>`;
    const embed = await createEmbed(interaction.guild!, title, description);

    await interaction.editReply({ content: "", embeds: [embed!] });
    logger.info(`command ${interaction.commandName} replyed successfully`, 3, interaction.guild!);
  } catch (error) {
    const msg = `Error executing ${interaction.commandName} command`;
    const user = interaction.user
    logger.error(msg, error, 3, __filename, interaction.guild!, user);

    await interaction.editReply({
      content: `Error executing ${interaction.commandName} command`,
    });
  }
}
