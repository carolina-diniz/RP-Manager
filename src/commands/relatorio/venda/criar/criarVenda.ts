import { CommandInteraction } from "discord.js";
import { Document, Types } from "mongoose";
import { logger } from "../../../../events/on-InteractionCreate/onInteractionCreate";
import { IModelGuild } from "../../../../interfaces/modelGuild";
import { createChannel } from "../../../../util/createChannel";
import { createEmbed } from "../../../../util/createEmbed";
import { getDbGuild } from "../../../../util/getDbGuild";
import { verifyPermissions } from "../../../../util/verifyPermissions";
import { verifyPremiumAccess } from "../../../../util/verifyPremiumAccess";

export async function criarVenda(interaction: CommandInteraction) {
  logger.setPath(__filename);
  try {
    await interaction.deferReply({ ephemeral: true });

    // Verifica se o usuário possui permissão para usar este comando
    const isAdmin = await verifyPermissions(interaction, "Administrator");
    if (!isAdmin) throw new Error("Usuário não possui permissão para usar este comando!");

    // Verifica se o servidor possui premium
    const isPremium = await verifyPremiumAccess(interaction);
    if (!isPremium) throw new Error("Este servidor não possui premium!");

    const dbGuild = await getDbGuild(interaction);
    if (!dbGuild) throw new Error("Guild não encontrada no banco de dados");

    let salesReportChannel = await interaction.guild!.channels.resolve(
      dbGuild.salesReportChannelId!
    );
    if (!salesReportChannel) {
      logger.command.warn("salesReportChannel não encontrado.");
      salesReportChannel = await createSalesReportChannel(interaction, dbGuild);
    }

    const embed = await createEmbed({
      guild: interaction.guild!,
      title: "Relatório de Vendas",
      description: `Canal de relatório de vendas criado com sucesso!\n<#${salesReportChannel!.id}>`,
      timestamp: true,
      footer: true,
      thumbnail: true,
    })

    interaction.editReply({
      content: '',
      embeds: [embed!]
    })
  } catch (error) {
    logger.command.error(``, error);
  }
}

async function createSalesReportChannel(
  interaction: CommandInteraction,
  dbGuild: Document<unknown, {}, IModelGuild> & IModelGuild & { _id: Types.ObjectId }
) {
  try {
    const salesReportChannel = await createChannel({
      name: "relatorio-venda",
      guild: interaction.guild!,
      category: null,
      permission: [
        {
          id: interaction.guild!.roles.everyone,
          allow: ["ViewChannel", "SendMessages"],
          deny: [
            "ManageMessages",
            "CreatePrivateThreads",
            "CreatePublicThreads",
            "SendTTSMessages",
            "SendVoiceMessages",
          ],
        },
      ],
    });
    if(!salesReportChannel) throw new Error('Error ao criar canal de relatório de vendas')

    dbGuild.salesReportChannelId = salesReportChannel!.id
    dbGuild.save()

    logger.database.info("salesReportChannelId atualizado no banco de dados", 'guild');

    return salesReportChannel;
  } catch (error) {
    logger.command.error("Error ao criar SalesReportChannel", error);
    return null;
  }
}