import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CategoryChannel,
  ChannelType,
  CommandInteraction,
  GuildBasedChannel,
  Message,
  TextChannel,
} from "discord.js";
import { logger } from "../../..";
import { createEmbed } from "../../../utils/createEmbed";
import { getGuild } from "../../../utils/getGuild";

export async function pedirsetCriar(interaction: CommandInteraction) {
  logger.init(__filename);
  try {
    const category = await createRecruitmentCategory(interaction);
    const pedirset = await createPedirsetChannel(interaction, category);
    const aprovarset = await createAprovarsetChannel(interaction, category);
    const message = await createPedirsetMessage(interaction, pedirset);
    await createFinalReplyMessage(interaction, pedirset, aprovarset, message);
  } catch (error) {
    logger.error("Error ao executar pedirsetCriar", error, 5, __filename);
    await interaction.editReply({ content: "Error executar comando `pedirset criar`" });
  }
}

async function createFinalReplyMessage(
  interaction: CommandInteraction,
  pedirset: GuildBasedChannel | TextChannel,
  aprovarset: GuildBasedChannel | TextChannel,
  message: Message
) {
  return new Promise(async (resolve, reject) => {
    try {
      const title = "Canal pedir-set criado!";
      const description = `Canal criado com sucesso!\nMas antes de você poder começar a pedir sets, configure os cargos de entrada usando o comando \`/pedirset entrada add\`.\n\n**Channels:**\n<#${pedirset.id}>\n<#${aprovarset.id}>\n\n**Message:**\n${message.url}`;

      const embed = await createEmbed(
        interaction.guild!,
        title,
        description,
        true,
        true,
        true
      );

      await interaction.editReply({
        content: "",
        embeds: [embed!],
      });
    } catch (error) {
      logger.error("Error replying interaction", error, 5, __filename);
    }
  });
}

async function createPedirsetMessage(
  interaction: CommandInteraction,
  channel: CategoryChannel | GuildBasedChannel
): Promise<Message> {
  return new Promise(async (resolve, reject) => {
    try {
      await interaction.editReply({ content: `Criando mensagem em <#${channel.id}>...` });
      if (!channel.isTextBased()) throw new Error("Channel is not text based");

      const title = `PEDIR SET ~ ${interaction.guild!.name.toUpperCase()}`;
      const description = `Sistema para pedir set do ${
        interaction.guild!.name
      }!\nPreencha com suas informações do jogo e não compartilhe informações pessoais.\n\nClique no botão \` Iniciar \` para pedir seu set.`;

      const embed = await createEmbed(
        interaction.guild!,
        title,
        description,
        false,
        true
      );

      const button = new ButtonBuilder()
        .setCustomId("pedirset")
        .setLabel("Iniciar")
        .setStyle(ButtonStyle.Success)
        .setEmoji({ name: "✅" });
      const row: any = new ActionRowBuilder().addComponents(button);

      await channel
        .send({
          embeds: [embed!],
          components: [row],
        })
        .then((message) => resolve(message));
    } catch (error) {
      logger.error("Error creating message in pedir-set channel", error, 5, __filename);
      await interaction.editReply({ content: "Error ao criar mensagem" });
      reject(error);
    }
  });
}

async function createAprovarsetChannel(
  interaction: CommandInteraction,
  category: CategoryChannel | GuildBasedChannel
): Promise<GuildBasedChannel | TextChannel> {
  return new Promise(async (resolve, reject) => {
    try {
      await interaction.editReply({ content: "Verificando canal aprovar-set..." });
      const guildDb = await getGuild(interaction.guildId!);
      if (!guildDb) throw new Error("Guild not found in database");

      if (guildDb.aprovarsetChannelId) {
        const channel = await interaction.guild!.channels.resolve(
          guildDb.aprovarsetChannelId
        );
        if (channel) resolve(channel);
        else throw new Error("Aprovarset channel not found");
      } else {
        const channel = await interaction.guild!.channels.create({
          name: "aprovar-set",
          parent: category.id,
          permissionOverwrites: [
            {
              id: interaction.guild!.roles.everyone.id,
              allow: ["ReadMessageHistory", "ManageMessages"],
              deny: [
                "ViewChannel",
                "SendMessages",
                "SendMessagesInThreads",
                "SendPolls",
                "SendTTSMessages",
                "SendVoiceMessages",
              ],
            },
          ],
          type: ChannelType.GuildText,
        });
        if (!channel) throw new Error("Error creating channel");
        logger.info(`Channel ${channel.name} created successfully`)
        guildDb.aprovarsetChannelId = channel.id;
        await guildDb.save();
        resolve(channel);
      }
    } catch (error) {
      logger.error("Error creating aprovar-set channel", error, 5, __filename);
      await interaction.editReply({ content: "Error ao criar canal aprovar-set" });
      reject(error);
    }
  });
}
async function createPedirsetChannel(
  interaction: CommandInteraction,
  category: CategoryChannel | GuildBasedChannel
): Promise<GuildBasedChannel | TextChannel> {
  return new Promise(async (resolve, reject) => {
    try {
      await interaction.editReply({ content: "Verificando canal pedirset..." });
      const guildDb = await getGuild(interaction.guildId!);
      if (!guildDb) throw new Error("Guild not found in database");

      if (guildDb.pedirsetChannelId) {
        const channel = await interaction.guild!.channels.resolve(
          guildDb.pedirsetChannelId
        );
        if (channel) return resolve(channel);
        else throw new Error("Pedirset channel not found");
      } else {
        const channel = await interaction.guild!.channels.create({
          name: "pedir-set",
          parent: category.id,
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
        guildDb.pedirsetChannelId = channel.id;
        await guildDb.save();
        resolve(channel);
      }
    } catch (error) {
      logger.error("Error creating pedir-set channel", error, 5, __filename);
      await interaction.editReply({ content: "Error ao criar canal pedir-set" });
      reject(error);
    }
  });
}

async function createRecruitmentCategory(
  interaction: CommandInteraction
): Promise<CategoryChannel | GuildBasedChannel> {
  return new Promise(async (resolve, reject) => {
    try {
      await interaction.editReply({ content: "Verificando categoria..." });
      const guildDb = await getGuild(interaction.guildId!);
      if (!guildDb) throw new Error("Guild not found in database");

      if (guildDb.recruitmentCategoryId) {
        const category = await interaction.guild!.channels.resolve(
          guildDb.recruitmentCategoryId
        );
        if (category) return resolve(category);
        else throw new Error("Recruitment category not found");
      } else {
        const category = await interaction.guild!.channels.create({
          name: "Recrutamento",
          type: ChannelType.GuildCategory,
        });
        if (!category) throw new Error("Error creating category");
        logger.info(`Channel ${category.name} created successfully`);
        guildDb.recruitmentCategoryId = category.id;
        await guildDb.save();
        resolve(category);
      }
    } catch (error) {
      logger.error("Error creating recruitment channel", error, 5, __filename);
      await interaction.editReply({ content: "Error ao criar categoria recrutamento" });
      reject(error);
    }
  });
}
