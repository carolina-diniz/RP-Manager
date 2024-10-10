import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { logger } from "../..";

export const data = new SlashCommandBuilder()
  .setName("comandos")
  .setDescription("Mosta uma lista de comandos disponíveis.");

export async function execute(interaction: CommandInteraction) {
  // Lista de comandos disponíveis
  const comandList = [
    "`/color` - Muda a cor das embeds. (premium)",
    "`/comandos` - Mostra a lista de comandos.",
    "`/pd` - Bane usuário do servidor. (premium)",
    "`/pedirset` - Formulário de entrada no servidor.",
    "`/uptime` - Mostra o tempo de atividade do bot.",
    "`/premium` - Mostra informações sobre o premium.",
  ];

  // Envia a lista de comandos disponíveis
  try {
    await interaction.reply({
      content: `## Comandos disponíveis:\n\n${comandList.join("\n")}`,
    });
  } catch (error) {
    const msg = `Error executing ${interaction.commandName} command`;
    const user = interaction.user;
    
    logger.error(msg, error, 3, __filename, interaction.guild!, user);
    await interaction.reply({ content: msg });
  }
}
