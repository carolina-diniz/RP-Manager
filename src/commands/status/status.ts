import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { createEmbed } from "../../util/createEmbed";
import { logger } from "../../util/logger";

export const data: SlashCommandBuilder = new SlashCommandBuilder()
  .setName("status")
  .setDescription("Comando para verificar informações do bot");

export async function execute(interaction: CommandInteraction, client: Client) {
  try {
    if (!interaction.guild) return;

    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const guild = interaction.guild;
    const title: string = `${client.user!.username}`;
    const description: string = `**Status**:  Online ✅\n**Uptime**: ${hours}h ${minutes}m ${seconds}s`;

    const embed = await createEmbed({ guild, title, description });
    if (!embed) return;

    interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    logger.error(__filename, error);
  }
}
