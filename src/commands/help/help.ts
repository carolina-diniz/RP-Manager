import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { createEmbed } from "../../util/createEmbed";
import { logger } from "../../util/logger";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Lista todos os comandos do RP Manager");

export async function execute(interaction: CommandInteraction) {
  try {
    const title = "Lista de comandos";
    const description = `
**Comandos:**
- **/status**: Mostra a quanto tempo o bot está online.
- **/pedirset**: Cria um canal para pedir sets de forma organizada.
- **/help**: Lista todos os comandos do RP Manager.
    `;

    const embed = await createEmbed({
      guild: interaction.guild!,
      title,
      description,
      footer: true,
      thumbnail: true,
    });

    interaction.reply({
      embeds: [embed!],
      ephemeral: true,
    });
  } catch (error) {
    logger.error(__filename, error);
  }
}
