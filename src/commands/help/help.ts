import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { logger } from "../../events/on-InteractionCreate/onInteractionCreate";
import { createEmbed } from "../../util/createEmbed";

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
- **/cargo_entrada_add**: Adiciona um cargo a lista de cargos **adicionados** ao aprovar set.
- **/cargo_entrada_remove**: Remove um cargo da lista de cargos **adicionados** ao aprovar set.
- **/remover_cargo_add**: Adiciona um cargo a lista de cargos **removidos** ao aprovar set.
- **/remover_cargo_remove**: Remove um cargo da lista de cargos **removidos** ao aprovar set.
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
    logger.command.error("", error);
  }
}
