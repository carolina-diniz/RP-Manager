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
- **/color**: Altera a cor das novas embeds.
- **/status**: Mostra a quanto tempo o bot está online.
- **/help**: Lista todos os comandos do RP Manager.
### Set:
- **/pedirset criar**: Cria um canal para pedir sets de forma automatizada.
- **/pedirset entrada add**: Adiciona um cargo a lista de cargos **adicionados** ao aprovar set.
- **/pedirset entrada del**: Remove um cargo da lista de cargos **adicionados** ao aprovar set.
- **/pedirset remover add**: Adiciona um cargo a lista de cargos **removidos** ao aprovar set.
- **/pedirset remover del**: Remove um cargo da lista de cargos **removidos** ao aprovar set.
### Relatórios:
- **/relatorio venda criar**: Cria um novo canal para receber os relatórios de vendas.
- **/relatorio venda config**: Adiciona uma nova porcentagem de venda para um cargo.

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
