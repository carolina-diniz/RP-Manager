import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { logger } from "../../..";
import { verifyPermission } from "../../services/verify-permission/verifyPermission";
import { database } from "../../services/database/database.service";

export const data = new SlashCommandBuilder()
  .setName("pedirset")
  .setDescription("Abre configurações de pedido de set.");

export async function execute(interaction: CommandInteraction) {
  try {
    logger.init({ filePath: __filename });
    await interaction.deferReply();

    // Verify permission
    const hasPermission = await verifyPermission(interaction, "Administrator");
    if (!hasPermission) throw new Error("Sem permissão");

    // Create buttons
    const buttons = await createButtonsHome();

    const embed = await createEmbedHome(interaction);

    // Send message
    await interaction.editReply({
      content: '',
      embeds: [embed],
      components: [buttons],
    });
  } catch (error) {
    logger.error("Error executing command", error, 5, __filename);
    await interaction.editReply({
      content: "Ocorreu um erro ao executar o comando.",
    });
  }
}

export async function createButtonsHome() {
  const button_01 = new ButtonBuilder()
    .setCustomId("pedirset_create_channels")
    .setLabel("➕ Criar canais")
    .setStyle(ButtonStyle.Secondary);

  const button_02 = new ButtonBuilder()
    .setCustomId("pedirset_edit_channels")
    .setLabel("✍️ Editar canais")
    .setStyle(ButtonStyle.Secondary);

  const button_03 = new ButtonBuilder()
    .setCustomId("pedirset_roles")
    .setLabel("🛂 Cargos")
    .setStyle(ButtonStyle.Secondary);

  const button_04 = new ButtonBuilder()
    .setCustomId("pedirset_close")
    .setLabel("❌ Fechar")
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    button_01,
    button_02,
    button_03,
    button_04
  );

  return row;
}

export async function createEmbedHome(
  interaction: CommandInteraction | ButtonInteraction
) {
  const guildDb = await database.getGuild(interaction.guildId!);
  const pedirsetID = guildDb?.pedirsetChannelId;
  const aprovarsetID = guildDb?.aprovarsetChannelId;
  const pedirsetRoleID = guildDb?.entryRoleId;

  const INTERACTION_PEDIRSET_TITLE = "Configurações de Pedido de Set";
  const INTERACTION_PEDIRSET_DESCRIPTION =
    "**CANAIS:**\n" +
    `Pedir set: <#${pedirsetID ?? "Não definido"}>\n` +
    `Aprovar set: <#${aprovarsetID ?? "Não definido"}>\n` +
    "\n**CARGOS:**\n" +
    `Entrada: <@&${pedirsetRoleID?.map((role) => role.id)[0] ?? "Não definido"}>\n` +
    "Aprovar: Em breve";

  // Create embed
  const embed = new EmbedBuilder()
    .setTitle(INTERACTION_PEDIRSET_TITLE)
    .setDescription(INTERACTION_PEDIRSET_DESCRIPTION);

  return embed;
}
