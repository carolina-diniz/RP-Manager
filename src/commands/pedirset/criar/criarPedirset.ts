import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, CommandInteraction, Guild, GuildBasedChannel } from "discord.js";
import { Document, Types } from "mongoose";
import { logger } from "../../../events/on-InteractionCreate/onInteractionCreate";
import { IModelGuild } from "../../../interfaces/modelGuild";
import { createChannel } from "../../../util/createChannel";
import { createEmbed } from "../../../util/createEmbed";
import { getDbGuild } from "../../../util/getDbGuild";
import { verifyPermissions } from "../../../util/verifyPermissions";

export async function criar(interaction: CommandInteraction) {
  try {
    // verifica se usuário possui permissão
    const isAdmin = await verifyPermissions(interaction, "Administrator");
    if (!isAdmin) throw new Error("Usuário não possui permissão para usar este comando");

    // busca dados da guild
    const dbGuild = await getDbGuild(interaction);
    if (!dbGuild) throw new Error("Guild não encontrada no banco de dados");

    // verifica se canal existe
    let recruitmentCategory = await verifyRecruitmentCategoryExist(
      interaction.guild!,
      dbGuild
    );

    // cria categoria caso não exista
    if (!recruitmentCategory) {
      recruitmentCategory = await createCategory(interaction.guild!, dbGuild);
    }

    // verifica se canal de pedirsets existe
    let pedirsetChannel: boolean | GuildBasedChannel | null =
      await verifyPedirsetChannelExist(interaction.guild!, dbGuild);

    // cria canal pedir-set caso não exista
    if (!pedirsetChannel) {
      pedirsetChannel = await createPedirsetChannel(
        interaction,
        dbGuild,
        recruitmentCategory!
      );
    }

    // verifica se canal de aprovarsets existe
    let aprovarsetChannel = await verifyAprovatsetChannelExist(
      interaction.guild!,
      dbGuild
    );

    // cria canal aprovar-set caso não exista
    if (!aprovarsetChannel) {
      aprovarsetChannel = await createAprovarsetChannel(
        interaction,
        dbGuild,
        recruitmentCategory!
      );
    }

    // cria mensagem inicial
    await createPedirsetMessage(interaction, pedirsetChannel!)

    // responde comando com mensagem de sucesso
    await createReplyMessage(interaction, pedirsetChannel!, aprovarsetChannel!)
  } catch (error) {
    logger.command.error('Error ao executar comando pedirset', error)
  }
}

async function verifyRecruitmentCategoryExist(
  guild: Guild,
  dbGuild: Document<unknown, {}, IModelGuild> & IModelGuild & { _id: Types.ObjectId }
) {
  try {
    // verifica se recrutamentoCategoryId existe no banco de dados
    const recrutamentoCategoryId = dbGuild.recrutamentoCategory;
    if (!recrutamentoCategoryId) {
      logger.database.warn("recrutamentoCategoryId não encontrado no banco de dados", 'guild')
      return false;
    }

    // verifica se categoria existe no Discord
    const category = await guild.channels.resolve(recrutamentoCategoryId);
    if (!category) {
      logger.command.warn("categoria não encontrada no Discord");
      return false;
    }

    logger.command.info("categoria para recrutamentos encontrada")
    return category;
  } catch (error) {
    logger.command.error("Erro ao verificar se existe categoria para recrutamentos", error)
    return null;
  }
}

async function createCategory(
  guild: Guild,
  dbGuild: Document<unknown, {}, IModelGuild> & IModelGuild & { _id: Types.ObjectId }
) {
  try {
    const category = await guild.channels.create({
      name: "Recrutamento",
      type: ChannelType.GuildCategory,
    });

    dbGuild.recrutamentoCategory = category.id;
    dbGuild.save();

    logger.command.info("Categoria para recrutamentos criada");
    return category;
  } catch (error) {
    logger.command.error("Erro ao criar categoria para recrutamentos", error);
    return null;
  }
}

async function verifyPedirsetChannelExist(
  guild: Guild,
  dbGuild: Document<unknown, {}, IModelGuild> & IModelGuild & { _id: Types.ObjectId }
) {
  try {
    // verifica se pedirsetChannelId existe no banco de dados
    const pedirsetChannelId = dbGuild.pedirsetChannelId;
    if (!pedirsetChannelId) {
      logger.database.warn("pedirsetChannelId não encontrado no banco de dados", 'guild');
      return false;
    }

    // verifica se canal existe no Discord
    const pedirsetChannel = await guild.channels.resolve(pedirsetChannelId);
    if (!pedirsetChannel) {
      logger.command.warn("canal pedir-set não encontrada no Discord");
      return false;
    }

    logger.command.info("canal pedir-set encontrado");
    return pedirsetChannel;
  } catch (error) {
    logger.command.error("Erro ao verificar se existe canal pedir-set", error);
    return null;
  }
}

async function verifyAprovatsetChannelExist(
  guild: Guild,
  dbGuild: Document<unknown, {}, IModelGuild> & IModelGuild & { _id: Types.ObjectId }
) {
  try {
    // verifica se aprovarsetChannelId existe no banco de dados
    const aprovarsetChannelId = dbGuild.aprovarsetChannelId;
    if (!aprovarsetChannelId) {
      logger.database.warn("aprovarsetChannelId não encontrado no banco de dados", 'guild');
      return false;
    }

    // verifica se categoria existe no Discord
    const aprovarsetChannel = await guild.channels.resolve(aprovarsetChannelId);
    if (!aprovarsetChannel) {
      logger.command.warn("categoria não encontrada no Discord");
      return false;
    }

    logger.command.info("canal aprovar-set encontrado");
    return aprovarsetChannel;
  } catch (error) {
    logger.command.error("Erro ao verificar se existe canal aprovar-set", error);
    return null;
  }
}

async function createPedirsetChannel(
  interaction: CommandInteraction,
  dbGuild: Document<unknown, {}, IModelGuild> & IModelGuild & { _id: Types.ObjectId },
  recruitmentCategory: GuildBasedChannel
) {
  try {
    const pedirsetChannel = await createChannel({
      guild: interaction.guild!,
      name: "pedir-set",
      permission: [
        {
          id: interaction.guild!.roles.everyone,
          allow: ["ViewChannel"],
          deny: ["SendMessages", "AddReactions", "ManageMessages"],
        },
      ],
      category: recruitmentCategory!.id,
    });

    dbGuild.pedirsetChannelId = pedirsetChannel?.id;
    dbGuild.save();

    logger.database.info("pedirsetChannelId atualizado no banco de dados", 'guild');

    return pedirsetChannel;
  } catch (error) {
    logger.command.error("Erro ao criar canal pedir-set", error);
    return null;
  }
}

async function createAprovarsetChannel(
  interaction: CommandInteraction,
  dbGuild: Document<unknown, {}, IModelGuild> & IModelGuild & { _id: Types.ObjectId },
  recruitmentCategory: GuildBasedChannel
) {
  try {
    const aprovarsetChannel = await createChannel({
      guild: interaction.guild!,
      name: "aprovar-set",
      permission: [
        {
          id: interaction.guild!.roles.everyone,
          allow: [],
          deny: ["ViewChannel", "SendMessages"],
        },
      ],
      category: recruitmentCategory!.id,
    });

    dbGuild.aprovarsetChannelId = aprovarsetChannel?.id;
    dbGuild.save();

    logger.database.info("aprovarsetChannelId atualizado no banco de dados", 'guild');
    return aprovarsetChannel;
  } catch (error) {
    logger.command.error("Erro ao criar canal aprovar-set",error);
    return null;
  }
}

async function createPedirsetMessage(
  interaction: CommandInteraction,
  pedirsetChannel: GuildBasedChannel
) {
  try {
    // Cria o botão
    const button: ButtonBuilder = new ButtonBuilder()
      .setCustomId("pedirset")
      .setLabel("Iniciar")
      .setStyle(ButtonStyle.Success)
      .setEmoji({ name: "✅" });

    // Cria a row com o botão
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

    // Envia a mensagem com o botão
    if (!pedirsetChannel || !pedirsetChannel.isTextBased()) return;
    await pedirsetChannel.send({
      embeds: [embed!],
      components: [row],
    });
    logger.command.info("mensagem de pedir set enviada");
  } catch (error) {
    logger.command.error("Erro ao criar mensagem pedirset", error);
  }
}

async function createReplyMessage(interaction: CommandInteraction, pedirsetChannel: GuildBasedChannel, aprovarsetChannel: GuildBasedChannel) {
  try {
    const embed = await createEmbed({
      guild: interaction.guild!,
      title: "Canal Pedir-Set Criado!",
      description: `<#${pedirsetChannel.id}>\n<#${aprovarsetChannel.id}>\n\nNão esqueça de configurar o cargo que o usuário receberá ao aprovar set, usando o comando \`/cargo_entrada_add\`.`,
      thumbnail: "https://media.tenor.com/bBGOaRPgtvQAAAAi/good-menhera.gif",
      footer: true,
      timestamp: true,
    })

    await interaction.reply({
      content: '',
      embeds: [embed!],
      ephemeral: true,
    })
    logger.command.info('mensagem de resposta para o comando enviada')
  } catch (error) {
    logger.command.error("Erro ao responder ao comando pedirset", error);
  }
}