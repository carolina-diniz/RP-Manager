import {
  Client,
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandRoleOption,
} from "discord.js";
import { logger } from "../../events/on-InteractionCreate/onInteractionCreate";
import { ModelGuild } from "../../models/modelGuild";
import { verifyPermissions } from "../../util/verifyPermissions";

export const data = new SlashCommandBuilder()
  .setName("cargo_entrada_add")
  .setDescription("Adiciona um cargo a lista de cargos adicionados ao aprovar set")
  .addRoleOption(
    new SlashCommandRoleOption()
      .setName("cargo")
      .setDescription("Adicionar cargo ao aprovar set")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction, client: Client) {
  try {
    if (!(await verifyPermissions(interaction, "Administrator"))) return;
    const dbGuild = await ModelGuild.findOne({ guildId: interaction.guildId });
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
