import {
  CommandInteraction
} from "discord.js";
import { logger } from "../../../events/on-InteractionCreate/onInteractionCreate";
import { ModelGuild } from "../../../models/modelGuild";
import { verifyPermissions } from "../../../util/verifyPermissions";


export async function entradaDel(interaction: CommandInteraction) {
  try {
    if (!(await verifyPermissions(interaction, "Administrator"))) return;
    const dbGuild = await ModelGuild.findOne({ guildId: interaction.guildId });
    if (!dbGuild || !dbGuild.entryRoleId) {
      throw new Error("dbGuild or dbGuild.entryRoleId not found");
    }

    const data = await interaction.options.get("cargo");
    const role = await data!.role;

    const listaRoles = dbGuild.entryRoleId?.split("+");

    listaRoles.forEach((roleId) => {
      if (roleId === role!.id) {
        listaRoles.splice(listaRoles.indexOf(roleId), 1);
        dbGuild.entryRoleId = listaRoles.join("+");
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
          content: "Error ao adicionar cargo",
          ephemeral: true,
        });
        logger.database.error(`Error ao tentar adicionar cargo`, "guild", err);
      });
  } catch (error) {
    await interaction.reply({
      content: `${error}`,
      ephemeral: true,
    });
    logger.command.error('', error);
  }
}
