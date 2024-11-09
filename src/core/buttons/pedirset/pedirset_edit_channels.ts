import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { logger } from "../../..";

export async function execute(interaction: ButtonInteraction) {
  try {
    logger.init({ filePath: __filename });

    const buttons = await createButtons()

    await interaction.update({ components: [buttons] });
  } catch (error) {
    logger.error("Error executing command", error, 5, __filename);
    await interaction.editReply({ content: "Ocorreu um erro ao executar o comando." });
  }
}

function createButtons() {
  const button_pedirset = new ButtonBuilder()
    .setCustomId("pedirset_edit_channels_pedirset")
    .setLabel("✍️ Editar Pedir Set")
    .setStyle(ButtonStyle.Secondary);

  const button_aprovarset = new ButtonBuilder()
    .setCustomId("pedirset_edit_channels_aprovarset")
    .setLabel("✍️ Editar Aprovar Set")
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