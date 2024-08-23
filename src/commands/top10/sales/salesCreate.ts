import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Document, Types } from "mongoose";
import { logger } from "../../..";
import { IModelSales } from "../../../interfaces/modelSales";
import { ModelMember } from "../../../models/modelMember";
import { ModelSales } from "../../../models/modelSales";
import { createEmbed } from "../../../utils/createEmbed";

type MongoRegister = Document<unknown, {}, IModelSales> &
  IModelSales & { _id: Types.ObjectId };

export async function salesCreate(interaction: CommandInteraction): Promise<void> {
  logger.init(__filename, 3, interaction.guild!);
  return new Promise(async (resolve, reject) => {
    try {
      //caso seja sábado 23:50 min ele envia uma mensagem com o nome dos 3 primeiros e apaga a mensagem com os 3 primeiros anteriores.
      const embed = await createContentMessage(interaction);

      await interaction
        .channel!.send({
          content: "||@here @everyone||",
          embeds: [embed],
        })
        .then((message) => {
          setInterval(async () => {
            const embed = await createContentMessage(interaction);
            message.edit({
              embeds: [embed],
            });
          }, 10 * 60 * 1000);
        });

      await interaction.deleteReply();
      logger.info(
        `command ${interaction.commandName} replyed successfully`,
        3,
        interaction.guild!
      );
      resolve();
    } catch (error) {
      logger.error(
        `Erro ao executar commando ${interaction.command?.name}`,
        error,
        5,
        __filename
      );
      reject(error);
    }
  });
}

function createContentMessage(interaction: CommandInteraction): Promise<EmbedBuilder> {
  return new Promise(async (resolve, reject) => {
    try {
      const dados = await getSalesReport(interaction.guildId!);
      const topLeaders = await calculateTopSellers(dados);
      let description = "";
      const memberDb = await ModelMember.find({ guildId: interaction.guildId });

      for (let i = 0; i < topLeaders.length; i++) {
        if (i == 10) break;
        description += `${i + 1} • ID: ${
          memberDb.filter((member) => member.memberId === topLeaders[i].memberId)[0].idIG
        } <@${topLeaders[i].memberId}> - \`${topLeaders[i].total} vendas\`\n`;
      }

      description += `\nAtualizado <t:${Math.floor(Date.now() / 1000)}:R>\n`;

      const embed = await createEmbed(
        interaction.guild!,
        "TOP 10 VENDEDORES 💼",
        description,
        true,
        false,
        true
      );

      resolve(embed);
    } catch (error) {
      reject(error);
    }
  });
}

function calculateTopSellers(
  registers: MongoRegister[]
): Promise<{ memberId: string; total: number }[]> {
  const sallers: { memberId: string; total: number }[] = [];
  return new Promise((resolve, reject) => {
    try {
      registers.forEach((register) => {
        const memberExist = sallers.find((s) => s.memberId === register.memberId);
        if (memberExist) {
          memberExist.total += register.items.reduce((total, item) => total + 1, 0);
        } else {
          sallers.push({
            memberId: register.memberId,
            total: register.items.reduce((total, item) => total + 1, 0),
          });
        }
      });

      resolve(sallers.sort((a, b) => b.total - a.total));
    } catch (error) {
      reject(error);
    }
  });
}

function getSalesReport(guildId: string): Promise<MongoRegister[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const dateUTC = new Date();
      const dataAtual = new Date(dateUTC.getTime() + -180 * 60000);

      // encontrando o domingo anteiror
      const diaDaSemana = dataAtual.getDay(); // 0(domingo) - 6(sabado)
      const domingoAnterior = new Date(dataAtual);
      domingoAnterior.setDate(dataAtual.getDate() - diaDaSemana);
      domingoAnterior.setHours(0, 0, 0, 0); // define as horas para 00:00:00:000

      // encontra o sábado da semana seguinte
      const proximosabado = new Date(domingoAnterior);
      proximosabado.setDate(domingoAnterior.getDate() + 6);
      proximosabado.setHours(23, 59, 59, 999); // define as horas para 23:59:59:999

      // busca os dados no banco de dados
      const dados = await ModelSales.find({
        createAt: {
          $gte: domingoAnterior,
          $lt: proximosabado,
        },
        guildId,
      });

      resolve(dados);
    } catch (error) {
      reject(error);
    }
  });
}
