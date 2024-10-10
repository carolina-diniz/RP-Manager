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
    logger.init({ filePath: __filename });
    const embed = await createEmbedHome(interaction);
    const buttons = createButtons();

    await interaction.update({ embeds: [embed], components: [buttons] });
  } catch (error) {
    logger.error("Error executing command", error, 5, __filename);
    await interaction.editReply({ content: "Ocorreu um erro ao executar o comando." });
  }
}

function createButtons() {
  const button_pedirset = new ButtonBuilder()
    .setCustomId("pedirset_create_channels_pedirset")
    .setLabel("🆕 Criar Pedir Set")
    .setStyle(ButtonStyle.Secondary);

  const button_aprovarset = new ButtonBuilder()
    .setCustomId("pedirset_create_channels_aprovarset")
    .setLabel("🆕 Criar Aprovar Set")
    .setStyle(ButtonStyle.Secondary);

  const button_back = new ButtonBuilder()
    .setCustomId("pedirset_back_home")
    .setLabel("◀️ Voltar")
    .setStyle(ButtonStyle.Secondary);

  const button_close = new ButtonBuilder()
    .setCustomId("pedirset_close")
    .setLabel("❌ Fechar")
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    button_pedirset,
    button_aprovarset,
    button_back,
    button_close
  );
  return row;
}
