import { CommandInteraction } from "discord.js";
import { logger } from "../../../events/on-InteractionCreate/onInteractionCreate";
import { ModelGuild } from "../../../models/modelGuild";
import { verifyPermissions } from "../../../util/verifyPermissions";

export async function removerDel(interaction: CommandInteraction) {
  try {
    if (!(await verifyPermissions(interaction, "Administrator"))) return;
    const dbGuild = await ModelGuild.findOne({ guildId: interaction.guildId });
    if (!dbGuild || !dbGuild.entryRoleRemove) {
      throw new Error("dbGuild or dbGuild.entryRoleRemove not found");
    }

    const data = await interaction.options.get("cargo");
    const role = await data!.role;

    const listaRoles = dbGuild.entryRoleRemove?.split("+");

    listaRoles.forEach((roleId) => {
      if (roleId === role!.id) {
        listaRoles.splice(listaRoles.indexOf(roleId), 1);
        dbGuild.entryRoleRemove = listaRoles.join("+");
      }
    });

    await dbGuild
      .save()
      .then(async () => {
        await interaction.reply({
          content: "Cargo removido com sucesso!",
          ephemeral: true,
        });
        logger.database.info("Cargo entryRole removido com sucesso!", "guild");
      })
      .catch(async (err) => {
        await interaction.reply({
          content: "Error ao remover cargo",
          ephemeral: true,
        });
        logger.database.error(`Error ao tentar remover cargo`, "guild", err);
      });
  } catch (error) {
    await interaction.reply({
      content: `${error}`,
      ephemeral: true,
    });
    logger.command.error("", error);
  }
}
