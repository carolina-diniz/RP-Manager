import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
} from "discord.js";
import { logger } from "../..";
import { createEmbedHome } from "../../commands/pedirset/pedirset";

export async function execute(interaction: ButtonInteraction) {
  try {
    const embed = await createEmbedHome(interaction);
    const buttons = await createButtons();

    await interaction.update({ embeds: [embed], components: [buttons] });
  } catch (error) {
    logger.error("Error executing command", error, 5, __filename);
    await interaction.reply({ content: "Ocorreu um erro ao executar o comando." });
  }
}

function createButtons() {
  const button_entry = new ButtonBuilder()
    .setCustomId("pedirset_roles_entry")
    .setLabel("📥 Entrada")
    .setStyle(ButtonStyle.Secondary);

  const button_aprove = new ButtonBuilder()
    .setCustomId("pedirset_roles_aprove")
    .setLabel("📥 Aprovar")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);

  const button_back = new ButtonBuilder()
    .setCustomId("pedirset_back_home")
    .setLabel("◀️ Voltar")
    .setStyle(ButtonStyle.Secondary);

  const button_close = new ButtonBuilder()
    .setCustomId("pedirset_close")
    .setLabel("❌ Fechar")
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    button_entry,
    button_aprove,
    button_back,
    button_close
  );
  return row;
}
