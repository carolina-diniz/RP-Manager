import { ModalSubmitInteraction } from "discord.js";
import { getGuild } from "../../utils/getGuild";

export async function execute(interaction: ModalSubmitInteraction) {
  try {
    const channel_set_id = interaction.fields.getTextInputValue(
      "pedirset_edit_channels_pedirset_setID"
    );

    const guildDb = await getGuild(interaction.guildId!);
    if (guildDb) {
      guildDb.pedirsetChannelId = channel_set_id;
      await guildDb.save();
    }

    await interaction.reply({ content: "Canal editado com sucesso!", ephemeral: true });
  } catch (error) {
    console.error("Error executing command", error);
    await interaction.editReply({ content: "Ocorreu um erro ao executar o comando." });
  }
}
