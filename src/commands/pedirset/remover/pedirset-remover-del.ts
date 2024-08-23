import { CommandInteraction } from "discord.js";
import { logger } from "../../..";
import { getGuild } from "../../../utils/getGuild";

export async function pedirsetRemoveDel(interaction: CommandInteraction): Promise<void> {
  logger.init(__filename)
  return new Promise(async (resolve, reject) => {
    try {
      const guildDb = await getGuild(interaction.guildId!);
      const data = await interaction.options.get("cargo");
      const role = await data!.role;

      if (!guildDb || !data || !role) throw new Error("Missing some data");

      if (guildDb.entryRoleRemoveId) {
        const entryRolesList = guildDb.entryRoleRemoveId.filter((roleId) => roleId.id !== role.id);
        guildDb.entryRoleRemoveId = entryRolesList;
        await guildDb.save();
        await interaction.editReply({
          content: `Cargo ${role.name} removido da lista de pedir-set-remover\n\`\`\`${guildDb.entryRoleRemoveId.map(role => role.name)}\`\`\``,
        });
      }
      resolve()
    } catch (error) {
      logger.error("Error while removing role to pedir-set-remover", error, 5, __filename);
      await interaction.editReply({
        content: "Error ao remover cargo da lista de pedir-set-remover",
      });
      reject(error);
    }
  });
}
