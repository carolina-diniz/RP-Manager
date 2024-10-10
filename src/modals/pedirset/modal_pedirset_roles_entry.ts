import { ModalSubmitInteraction } from "discord.js";
import { getGuild } from "../../utils/getGuild";

export async function execute(interaction: ModalSubmitInteraction) {
  try {
    const role_set_id = interaction.fields.getTextInputValue(
      "pedirset_roles_entry_setID"
    );

    const role = interaction.guild?.roles.resolve(role_set_id);

    const guildDb = await getGuild(interaction.guildId!);
    if (guildDb) {
      guildDb.entryRoleId = [{ id: role_set_id, name: `${role?.name}`}];
      await guildDb.save();
    }

    await interaction.reply({ content: "Cargo editado com sucesso!", ephemeral: true });
  } catch (error) {
    console.error("Error executing command", error);
    await interaction.editReply({ content: "Ocorreu um erro ao executar o comando." });
  }
}
