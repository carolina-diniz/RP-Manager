import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandRoleOption,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";
import { logger } from "../..";
import { verifyPermission } from "../../utils/verifyPermission";
import { verifyPremiumAccess } from "../../utils/verifyPremiumAccess";
import { relatorioBauCommand } from "./bau/relatorio-bau";
import { relatorioVendaCommand } from "./venda/relatorio-venda";

export const data = new SlashCommandBuilder()
  .setName("relatorios")
  .setDescription("relatorios")
  .addSubcommandGroup(
    new SlashCommandSubcommandGroupBuilder()
      .setName("venda")
      .setDescription("venda")
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("criar")
          .setDescription("Cria a estrutura básica para o relatório de vendas")
      )
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("config")
          .setDescription("config")
          .addRoleOption(
            new SlashCommandRoleOption()
              .setName("cargo")
              .setDescription("cargo")
              .setRequired(true)
          )
          .addIntegerOption(
            new SlashCommandIntegerOption()
              .setName("porcentagem")
              .setDescription(
                "Define a porcentagem de lucro de vendas que um cargo específico receberá."
              )
              .setRequired(true)
              .setMinValue(0)
              .setMaxValue(100)
          )
      )
  )
  .addSubcommandGroup(
    new SlashCommandSubcommandGroupBuilder()
      .setName("bau")
      .setDescription("bau")
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("criar")
          .setDescription("Cria a estrutura básica para o relatório de baús.")
      )
  );

export async function execute(interaction: CommandInteraction) {
  logger.init(__filename, 3, interaction.guild!);
  
  try {
    await interaction.deferReply({ ephemeral: true });
    if (
      !(await verifyPremiumAccess(interaction)) ||
      !(await verifyPermission(interaction, "Administrator"))
    )
      return null;

    const group = await interaction.options.data[0].name;

    if (group === "venda") {
      await relatorioVendaCommand(interaction);
    } else if (group === "bau") {
      await relatorioBauCommand(interaction);
    }
  } catch (error) {
    const msg = `Error executing ${interaction.commandName} command`;
    const user = interaction.user;
    logger.error(msg, error, 3, __filename, interaction.guild!, user);

    await interaction.editReply({
      content: `Error executing ${interaction.commandName} command`,
    });
  }
}
