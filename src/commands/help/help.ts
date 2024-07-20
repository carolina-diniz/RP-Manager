import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { logger } from "../../events/on-InteractionCreate/onInteractionCreate";
import { createEmbed } from "../../util/createEmbed";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Lista todos os comandos do RP Manager");

export async function execute(interaction: CommandInteraction) {
  try {
    const description = `
# Lista de comandos:
### Geral:
- **/status**: Mostra a quanto tempo o bot está online.
- **/help**: Lista todos os comandos do RP Manager.
### Set:
- **/pedirset criar**: Cria um canal para pedir sets de forma automatizada.
- **/pedirset entrada add**: Adiciona um cargo a lista de cargos **adicionados** ao aprovar set.
- **/pedirset entrada del**: Remove um cargo da lista de cargos **adicionados** ao aprovar set.
- **/pedirset remover add**: Adiciona um cargo a lista de cargos **removidos** ao aprovar set.
- **/pedirset remover del**: Remove um cargo da lista de cargos **removidos** ao aprovar set.
    `;

    const embed = await createEmbed({
      guild: interaction.guild!,
      description,
      footer: true,
      thumbnail: true,
      timestamp: true
    });

    interaction.reply({
      embeds: [embed!],
      ephemeral: true,
    });
  } catch (error) {
    logger.command.error("", error);
  }
}
