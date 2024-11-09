import { ModalSubmitInteraction } from "discord.js";
import { database } from "../../services/database/database.service";

export async function execute(interaction: ModalSubmitInteraction) {
  try {
    const role_set_id = interaction.fields.getTextInputValue(
      "pedirset_roles_entry_setID"
    );

    const role = interaction.guild?.roles.resolve(role_set_id);

    const guildDb = await database.getGuild(interaction.guildId!);
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
