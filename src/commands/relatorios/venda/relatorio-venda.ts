import {
  ChannelType,
  CommandInteraction,
  GuildBasedChannel,
  TextChannel,
} from "discord.js";
import { logger } from "../../..";
import { createEmbed } from "../../../utils/createEmbed";
import { getGuild } from "../../../utils/getGuild";

export async function relatorioVendaCommand(
  interaction: CommandInteraction
): Promise<void> {
  logger.init(__filename, 3, interaction.guild!);

  return new Promise(async (resolve, reject) => {
    try {
      if (interaction.options.data[0].options![0].name === "criar") {
        await relatorioVendaCriar(interaction);
      }
      if (interaction.options.data[0].options![0].name === "config") {
        await relatorioVendaPorcentagem(interaction);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function relatorioVendaPorcentagem(interaction: CommandInteraction): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const guildDb = await getGuild(interaction.guildId!);
      const role = await interaction.options.get("cargo")?.role;
      const percent = await interaction.options.get("porcentagem")?.value;

      if (!guildDb || !role || !percent || typeof percent !== "number") return;

      if (!guildDb.reportSalesRolesId) {
        guildDb.reportSalesRolesId = [{ id: role.id, percent }];
      } else {
        if (
          guildDb.reportSalesRolesId.filter((roleParam) => roleParam.id === role.id)
            .length > 0
        ) {
          guildDb.reportSalesRolesId = guildDb.reportSalesRolesId.map((roleParam) => {
            if (roleParam.id === role.id) {
              roleParam.percent = percent;
            }
            return roleParam;
          });
        } else {
          guildDb.reportSalesRolesId.push({ id: role.id, percent });
        }
      }

      guildDb.save();

      const embed = await createEmbed(
        interaction.guild!,
        "Porcentagem de Venda Atualizada!",
        `Porcentagem de venda do cargo **${role.name}**:\n\n**Percentual:** ${percent}%`,
        false,
        true
      );

      await Promise.all(
        guildDb.reportSalesRolesId.map(async (roleParam) => {
          const role = await interaction.guild!.roles.resolve(roleParam.id);
          if (role) {
            embed!.addFields({
              name: role.name,
              value: `${roleParam.percent}%`,
              inline: true,
            });
          }
        })
      );

      await interaction.editReply({ content: "", embeds: [embed!] });
      logger.info(
        `command ${interaction.commandName} replyed successfully`,
        3,
        interaction.guild!
      );
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function relatorioVendaCriar(interaction: CommandInteraction): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const channel = await createSalesReportChannel(interaction);

      const title = "Relatório de Vendas";
      const description = `Canal de relatório de vendas criado com sucesso!\n<#${
        channel!.id
      }>`;

      const embed = await createEmbed(
        interaction.guild!,
        title,
        description,
        true,
        true,
        true
      );

      await interaction.editReply({ content: "", embeds: [embed!] });
      logger.info(
        `command ${interaction.commandName} replyed successfully`,
        3,
        interaction.guild!
      );
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function createSalesReportChannel(
  interaction: CommandInteraction
): Promise<TextChannel | GuildBasedChannel> {
  return new Promise(async (resolve, reject) => {
    try {
      await interaction.editReply({ content: "Verificando canal relatorio-venda..." });
      const guildDb = await getGuild(interaction.guildId!);
      if (!guildDb) throw new Error("Guild not found in database");

      if (guildDb.reportSalesId) {
        const channel = await interaction.guild!.channels.resolve(guildDb.reportSalesId);
        if (channel) resolve(channel);
        else throw new Error("Report sales channel not found in database");
      } else {
        const channel = await interaction.guild!.channels.create({
          name: "relatorio-vendas",
          permissionOverwrites: [
            {
              id: interaction.guild!.roles.everyone.id,
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
          type: ChannelType.GuildText,
          topic: "Canal para armazenar relatórios de vendas",
        });
        if (!channel) throw new Error("Error creating channel");
        logger.info(`Channel ${channel.name} created successfully`, 5, interaction.guild!);
        guildDb.reportSalesId = channel.id;
        await guildDb.save();
        resolve(channel);
      }
    } catch (error) {
      reject(error);
    }
  });
}
