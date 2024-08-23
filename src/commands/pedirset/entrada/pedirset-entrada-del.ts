import { CommandInteraction } from "discord.js";
import { logger } from "../../..";
import { getGuild } from "../../../utils/getGuild";

export async function pedirsetEntradaDel(interaction: CommandInteraction): Promise<void> {
  logger.init(__filename)
  return new Promise(async (resolve, reject) => {
    try {
      const guildDb = await getGuild(interaction.guildId!);
      const data = await interaction.options.get("cargo");
      const role = await data!.role;

      if (!guildDb || !data || !role) throw new Error("Missing some data");

      if (guildDb.entryRoleId) {
        const entryRolesList = guildDb.entryRoleId.filter((roleId) => roleId.id !== role.id);
        guildDb.entryRoleId = entryRolesList;
        await guildDb.save();
        await interaction.editReply({
          content: `Cargo ${role.name} removido da lista de pedir-set-adding\n\`\`\`${guildDb.entryRoleId.map(role => role.name)}\`\`\``,
        });
      }
      resolve()
    } catch (error) {
      logger.error("Error while removing role to pedir-set-adding", error, 5, __filename);
      await interaction.editReply({
        content: "Error ao remover cargo da lista de pedir-set-adding",
      });
      reject(error);
    }
  });
}
