import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import "dotenv/config";
import { logger } from "../../..";
import { createEmbed } from "../../../utils/createEmbed";
import { client } from "../../../connections/discord.connection";

export const data = new SlashCommandBuilder()
  .setName("premium")
  .setDescription("premium");

export async function execute(interaction: CommandInteraction) {
  logger.init({filePath: __filename});
  try {
    await interaction.deferReply();

    const embed = await createEmbed(
      interaction.guild!,
      "✨ ACESSO PREMIUM ✨",
      `**RP Manager:** O assistente essencial para administrar servidores de GTA RP. \nPersonalize embeds, limpe mensagens e automatize relatórios. Tudo por apenas ${parseFloat(
        process.env.premiumPrice!
      ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}/mês\n\nDúvidas? [RP Manager](https://discord.gg/cPYavJAFrY)`,
      {
        text: "RP Manager",
        iconURL: await client.user!.displayAvatarURL(),
      },
      "https://cdn.discordapp.com/emojis/1228697661771747368.gif"
    );

    const button1 = new ButtonBuilder()
      .setCustomId("premium_gerarlink")
      .setStyle(ButtonStyle.Secondary)
      .setLabel("Gerar Link")
      .setEmoji("🔗");

    const button2 = new ButtonBuilder()
      .setCustomId("premium_gerarqrcode")
      .setStyle(ButtonStyle.Secondary)
      .setLabel("Gerar QR Code")
      .setEmoji("📱");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button1, button2);

    await interaction.editReply({ embeds: [embed], components: [row] });
  } catch (error) {
    const msg = `Error executing ${interaction.commandName} command`;
    const user = interaction.user;
    logger.error(msg, error, 3, __filename, interaction.guild!, user);

    await interaction.editReply({
      content: `Error executing ${interaction.commandName} command`,
    });
  }
}
