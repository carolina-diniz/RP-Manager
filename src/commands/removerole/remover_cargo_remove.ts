import {
  Client,
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandRoleOption,
} from "discord.js";
import { ModelGuild } from "../../models/modelGuild";
import { logger } from "../../util/logger";
import { verifyPermissions } from "../../util/verifyPermissions";

export const data = new SlashCommandBuilder()
  .setName("remover_cargo_remove")
  .setDescription("Remove role ao receber aprovação de set")
  .addRoleOption(
    new SlashCommandRoleOption()
      .setName("cargo")
      .setDescription("Remove cargo ao aprovar set")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction, client: Client) {
  try {
    if(!await verifyPermissions(interaction, 'Administrator')) return;
    const dbGuild = await ModelGuild.findOne({ guildId: interaction.guildId });
    if (!dbGuild || !dbGuild.entryRoleRemove) {
      throw new Error('dbGuild or dbGuild.entryRoleRemove not found')
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
        logger.database.update("Cargo entryRole removido com sucesso!");
      })
      .catch(async (err) => {
        await interaction.reply({
          content: "Error ao adicionar cargo",
          ephemeral: true,
        });
        logger.database.error(
          `${__filename} Error: Error ao tentar adicionar cargo a guild [${interaction.guild?.name}]`,
          err
        );
      });
  } catch (error) {
    await interaction.reply({
      content: `${error}`,
      ephemeral: true,
    })
    logger.error(__filename, error);
  }
}
