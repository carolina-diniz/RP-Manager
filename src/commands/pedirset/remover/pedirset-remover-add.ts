import { CommandInteraction } from "discord.js";
import { logger } from "../../..";
import { getGuild } from "../../../utils/getGuild";

export async function pedirsetRemoveAdd(interaction: CommandInteraction) {
  logger.init(__filename);
  return new Promise(async (resolve, reject) => {
    try {
      const guildDb = await getGuild(interaction.guildId!);
      const data = await interaction.options.get("cargo");
      const role = await data!.role;

      if (!guildDb || !data || !role) throw new Error("Missing some data");

      if (!guildDb.entryRoleRemoveId) {
        guildDb.entryRoleRemoveId = [{id: role.id, name: role.name}];
      } else {
        guildDb.entryRoleRemoveId.push({id: role.id, name: role.name});
      }

      await guildDb.save();
      await interaction.editReply({
        content: `Cargo ${role.name} adicionado à lista de pedir-set-remover\n\`\`\`${guildDb.entryRoleRemoveId.map(role => role.name)}\`\`\``,
      });
      resolve(role);
    } catch (error) {
      logger.error("Error while removing role to pedir-set-remover", error, 5, __filename);
      await interaction.editReply({
        content: "Error ao adicionar cargo à lista de pedir-set-remover",
      });
      reject(error);
    }
  });
}
