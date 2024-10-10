import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelType,
  GuildBasedChannel,
} from "discord.js";
import { logger } from "../..";
import { createButtonsHome, createEmbedHome } from "../../commands/pedirset/pedirset";
import { createEmbed } from "../../utils/createEmbed";
import { getGuild } from "../../utils/getGuild";

export async function execute(interaction: ButtonInteraction) {
  try {
    logger.init({ filePath: __filename });
    const channel = await createPedirsetChannel(interaction);
    if (!channel) throw new Error("Error creating channel");

    await createPedirsetMessage(interaction, channel);

    const embed = await createEmbedHome(interaction);
    const buttons = await createButtonsHome();
    await interaction.update({ embeds: [embed], components: [buttons] });
  } catch (error) {
    logger.error("Error executing command", error, 5, __filename);
    await interaction.editReply({ content: "Ocorreu um erro ao executar o comando." });
  }
}

async function createPedirsetChannel(interaction: ButtonInteraction) {
  try {
    console.log("inside createPedirsetChannel");
    const guildDb = await getGuild(interaction.guildId!);
    const channel = await interaction.guild?.channels.create({
      name: "pedir-set",
      permissionOverwrites: [
        {
          id: interaction.guild!.roles.everyone.id,
          allow: ["ViewChannel", "ReadMessageHistory"],
          deny: [
            "SendMessages",
            "SendMessagesInThreads",
            "SendPolls",
            "SendTTSMessages",
            "SendVoiceMessages",
            "ManageMessages",
            "AddReactions",
          ],
        },
      ],
      type: ChannelType.GuildText,
    });

    if (!channel) throw new Error("Error creating channel");
    logger.info(`Channel ${channel.name} created successfully`);

    if (guildDb) {
      guildDb.pedirsetChannelId = channel.id;
      await guildDb.save();
    }

    return channel;
  } catch (error) {}
}

async function createPedirsetMessage(
  interaction: ButtonInteraction,
  channel: GuildBasedChannel
) {
  try {
    if (!channel.isTextBased()) throw new Error("Channel is not text based");

    const TITLE = `PEDIR SET ~ ${interaction.guild!.name.toUpperCase()}`;
    const description =
      `Sistema para pedir set do ${interaction.guild!.name}!\n` +
      `Preencha com suas informações do jogo e não compartilhe informações pessoais.\n\n` +
      `Clique no botão \` Iniciar \` para pedir seu set.`;

    const embed = await createEmbed(interaction.guild!, TITLE, description, false, true);

    const button = new ButtonBuilder()
      .setCustomId("pedirset")
      .setLabel("Iniciar")
      .setStyle(ButtonStyle.Success)
      .setEmoji({ name: "✅" });
    const row: any = new ActionRowBuilder().addComponents(button);

    const message = await channel.send({
      embeds: [embed!],
      components: [row],
    });

    return message;
  } catch (error) {
    logger.error("Error creating message in pedir-set channel", error, 5, __filename);
    await interaction.editReply({ content: "Error ao criar mensagem" });
  }
}
