import { CommandInteraction } from "discord.js";
import { logger } from "../../../events/on-InteractionCreate/onInteractionCreate";
import { getDbGuild } from "../../../util/getDbGuild";
import { verifyPermissions } from "../../../util/verifyPermissions";

export async function entradaAdd(interaction: CommandInteraction) {
  try {
    if (!(await verifyPermissions(interaction, "Administrator"))) return;
    const dbGuild = await getDbGuild(interaction)
    if (!dbGuild) {
      throw new Error("dbGuild or dbGuild.entryRoleId not found");
    }

    const data = await interaction.options.get("cargo");
    const role = await data!.role;

    if (!dbGuild.entryRoleId) {
      dbGuild.entryRoleId = role!.id;
    } else {
      dbGuild.entryRoleId = `${dbGuild.entryRoleId}+${role!.id}`;
    }

    await dbGuild
      .save()
      .then(async () => {
        await interaction.reply({
          content: "Cargo adicionado com sucesso!",
          ephemeral: true,
        });
        logger.database.info("Novo cargo adicionado ao entry role", "guild");
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
