import { ButtonInteraction, CommandInteraction, EmbedBuilder } from "discord.js";
import { logger } from "../events/on-InteractionCreate/onInteractionCreate";
import { ModelGuild } from "../models/modelGuild";

export async function getDbGuild(interaction: CommandInteraction | ButtonInteraction) {
  await logger.setPath(__filename)
  try {
    logger.database.info("Buscando por guild no banco de dados...", "guild");

    const dbGuild = await ModelGuild.findOne({ guildId: interaction.guildId });
    if (!dbGuild) throw new Error("Guild não encontrada no banco de dados.");

    logger.database.info(
      `Guild encontrada no banco de dados: ${dbGuild.name}`,
      "guild"
    );
    return dbGuild;
  } catch (error) {
    logger.database.error("Guild encontrada no banco de dados", "guild", error);
    logger.system.info("criando mensagem de resposta...");

    const embed = new EmbedBuilder()
      .setTitle("⚠️Erro! Servidor não encontrado!⚠️")
      .setDescription(
        "Não foi possivel encontrar seu servidor no nosso sistema, mas não fique triste, contate um dos nossos desenvolvedores no servidor official do **[RP Manager](https://discord.gg/76PaKxaWda)**.\n\n**[RP Manager Suporte](https://discord.gg/76PaKxaWda)**"
      )
      .setThumbnail(interaction.guild?.iconURL() ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: `${interaction.guild!.name}`,
        iconURL: interaction.guild!.iconURL() ?? undefined,
      });

    await interaction.reply({
      content: "",
      embeds: [embed!],
    });
    logger.system.info("mensagem de resposta enviada!");

    return null;
  }
}
