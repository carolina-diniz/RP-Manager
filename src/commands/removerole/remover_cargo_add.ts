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
  .setName("remover_cargo_add")
  .setDescription("Adiciona role para ser removida ao aprovar set")
  .addRoleOption(
    new SlashCommandRoleOption()
      .setName("cargo")
      .setDescription("Adicionar cargo para remover ao aprovar set")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction, client: Client) {
  try {
    if(!await verifyPermissions(interaction, 'Administrator')) return;
    const dbGuild = await ModelGuild.findOne({ guildId: interaction.guildId });
    if (!dbGuild) {
      throw new Error('dbGuild or dbGuild.entryRoleRemove not found')
    }

    const data = await interaction.options.get("cargo");
    const role = await data!.role;

    if (!dbGuild.entryRoleRemove) {
      dbGuild.entryRoleRemove = role!.id;
    } else {
      dbGuild.entryRoleRemove = `${dbGuild.entryRoleRemove}+${role!.id}`;
    }

    await dbGuild
      .save()
      .then(async () => {
        await interaction.reply({
          content: "Cargo adicionado com sucesso!",
          ephemeral: true,
        });
        logger.database.update("Novo cargo adicionado ao entry role");
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
