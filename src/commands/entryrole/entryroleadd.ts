import {
  Client,
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandRoleOption,
} from "discord.js";
import { ModelGuild } from "../../models/modelGuild";
import { logger } from "../../util/logger";

export const data = new SlashCommandBuilder()
  .setName("entryroleadd")
  .setDescription("Adiciona role para ser recebida ao aprovar set")
  .addRoleOption(
    new SlashCommandRoleOption()
      .setName("cargo")
      .setDescription("Adicionar cargo ao aprovar set")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction, client: Client) {
  try {
    const dbGuild = await ModelGuild.findOne({ guildId: interaction.guildId });
    if (!dbGuild) {
      throw new Error('dbGuild or dbGuild.entryRoleId not found')
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
