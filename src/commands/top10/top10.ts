import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { logger } from "../..";
import { verifyPermission } from "../../utils/verifyPermission";
import { verifyPremiumAccess } from "../../utils/verifyPremiumAccess";
import { recruitersCreate } from "./recruiters/recruitersCreate";
import { salesCreate } from "./sales/salesCreate";

export const data = new SlashCommandBuilder()
  .setName("top10")
  .setDescription("top10")
  .addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName("recrutamento")
      .setDescription(
        "Exibe um ranking com os 10 membros que mais recrutaram no servidor."
      )
  )
  .addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName("vendas")
      .setDescription(
        "Mostra um ranking com os 10 membros que mais realizaram vendas no servidor."
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
      return;

    const subcommand = interaction.options.data[0].name;

    if (subcommand === "recrutamento") {
      await recruitersCreate(interaction);
    }
    if (subcommand === "vendas") {
      await salesCreate(interaction);
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
