import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Client,
  CommandInteraction,
  Guild,
  SlashCommandBuilder,
} from "discord.js";
import { Document, Types } from "mongoose";
import { IModelGuild } from "../../interfaces/modelGuild";
import { ModelGuild } from "../../models/modelGuild";
import { createChannel } from "../../util/createChannel";
import { createEmbed } from "../../util/createEmbed";
import { logger } from "../../util/logger";
import { verifyPermissions } from "../../util/verifyPermissions";

export const data: SlashCommandBuilder = new SlashCommandBuilder()
  .setName("pedirset")
  .setDescription("Cria um canal para pedir sets de forma organizada.");

export async function execute(interaction: CommandInteraction, client: Client) {
  try {
    await interaction.deferReply({ ephemeral: true });

    // verifica se usuário possui permissão
    if (!(await verifyPermissions(interaction, "Administrator"))) return;

    // busca dados da guild no banco de dados
    const dbGuild = await ModelGuild.findOne({ guildId: interaction.guild!.id });

    // verifica se guild existe no banco de dados
    if (!dbGuild) {
      logger.database.error(__filename, "Guild not found");
      await interaction.editReply("Este servidor não está cadastrado no sistema!");
      return;
    }

    // Cira os canais caso não existam
    await createChannels(interaction.guild!, dbGuild);

    // verifica se o canal de pedir set existe e cria caso não exista
    const pedirsetChannel = await interaction.guild!.channels.resolve(
      dbGuild.pedirsetChannelId!
    );

    // Cria o botão
    const button: ButtonBuilder = new ButtonBuilder()
      .setCustomId("pedirset")
      .setLabel("Iniciar")
      .setStyle(ButtonStyle.Success)
      .setEmoji({ name: "✅" });
    const row: any = new ActionRowBuilder().addComponents(button);

    // Cria o embed
    const embed = await createEmbed({
      title: `PEDIR SET ~ ${interaction.guild!.name.toUpperCase()}`,
      description: `Sistema para pedir set do ${
        interaction.guild!.name
      }!\nPreencha com suas informações do jogo e não compartilhe informações pessoais.\n\nClique no botão \` Iniciar \` para pedir seu set.`,
      thumbnail: true,
      guild: interaction.guild!,
    });
    if (!embed) return;

    // Envia a mensagem com o botão
    if (!pedirsetChannel || !pedirsetChannel.isTextBased()) return;
    await pedirsetChannel.send({
      embeds: [embed],
      components: [row],
    })

    interaction.deleteReply();
  } catch (error) {
    logger.error(__filename, error);
  }
}

async function createPedirsetChannel(
  guild: Guild,
  dbGuild: Document<unknown, {}, IModelGuild> & IModelGuild & { _id: Types.ObjectId }
) {
  try {
    let categoryId: string | undefined = dbGuild.recrutamentoCategory
    if (!categoryId) {
      categoryId = await createCategory(guild, dbGuild)
    }

    const channel = await createChannel({
      name: "pedir-set",
      guild,
      permission: [
        {
          id: guild.roles.everyone,
          allow: ["ViewChannel"],
          deny: ["SendMessages", "AddReactions", "ManageMessages"],
        },
      ],
      category: categoryId
    });

    if (channel) {
      logger.updated(
        `New Channel Created at ${guild.name}: Channel Name: ${channel!.name}`
      );
    } else {
      throw new Error("Error ao criar canal");
    }

    dbGuild.pedirsetChannelId = channel.id;
    await dbGuild
      .save()
      .then(() => logger.database.create("pedirset channel id"))
      .catch((err: any) => logger.database.error(__filename, err));

    return channel;
  } catch (error) {
    logger.error(__filename, error);
    return null;
  }
}

async function createAprovarsetChannel(
  guild: Guild,
  dbGuild: Document<unknown, {}, IModelGuild> & IModelGuild & { _id: Types.ObjectId }
) {
  try {
    let categoryId: string | undefined = dbGuild.recrutamentoCategory
    if (!categoryId) {
      categoryId = await createCategory(guild, dbGuild)
    }

    const channel = await createChannel({
      name: "aprovar-set",
      guild,
      permission: [
        {
          id: guild.roles.everyone,
          allow: [],
          deny: ["ViewChannel", "SendMessages"],
        },
      ],
      category: categoryId
    });

    if (channel) {
      logger.updated(
        `New Channel Created at ${guild.name}: Channel Name: ${channel!.name}`
      );
    } else {
      throw new Error("Error ao criar canal");
    }

    dbGuild.aprovarsetChannelId = channel.id;
    await dbGuild
      .save()
      .then(() => logger.database.create("aprovar channel id"))
      .catch((err: any) => logger.database.error(__filename, err));

    return channel;
  } catch (error) {
    logger.error(__filename, error);
    return null;
  }
}

async function createChannels(
  guild: Guild,
  dbGuild: Document<unknown, {}, IModelGuild> & IModelGuild & { _id: Types.ObjectId }
) {
  try {
    // Cria o canal de pedir set
    let pedirsetChannel = await guild.channels.resolve(dbGuild.pedirsetChannelId!);
    if (!pedirsetChannel || pedirsetChannel.id != dbGuild.pedirsetChannelId) {
      pedirsetChannel = await createPedirsetChannel(guild, dbGuild);
      if (!pedirsetChannel) throw new Error("Error ao criar canal");
    }

    // Cria o canal de aprovar set
    let aprovarsetChannel = await guild.channels.resolve(dbGuild.aprovarsetChannelId!);
    if (!aprovarsetChannel || aprovarsetChannel.id != dbGuild.aprovarsetChannelId) {
      aprovarsetChannel = await createAprovarsetChannel(guild, dbGuild);
      if (!aprovarsetChannel) throw new Error("Error ao criar canal");
    }
  } catch (error) {
    logger.error(__filename, error);
  }
}

async function createCategory(
  guild: Guild,
  dbGuild: Document<unknown, {}, IModelGuild> & IModelGuild & { _id: Types.ObjectId }
) {
  try {
    const category = await guild.channels.create({
      name: 'Recrutamento',
      type: ChannelType.GuildCategory,
    })

    dbGuild.recrutamentoCategory = category.id
    dbGuild.save()

    return category.id
  } catch (error) {
    logger.error(__filename, error);
    return undefined;
  }
}
