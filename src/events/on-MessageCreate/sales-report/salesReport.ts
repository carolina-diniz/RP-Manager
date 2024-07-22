import { GuildMember, Message } from "discord.js";
import { Document, Types } from "mongoose";
import { IModelGuild } from "../../../interfaces/modelGuild";
import { ModelGuild } from "../../../models/modelGuild";
import { createEmbed } from "../../../util/createEmbed";
import { verifyPremiumAccessMessage } from "../../../util/verifyPremiumAccessMessage";
import { logger } from "../onMessageCreate";
import { municao } from "./table";

export async function salesReport(message: Message) {
  let isValid = true;
  let isPartnership = false;
  let totalPrice = 0;

  logger.setPath(__filename);

  try {
    const isPremium = await verifyPremiumAccessMessage(message);
    if (!isPremium) return;

    const dbGuild = await ModelGuild.findOne({ guildId: message.guildId });

    if (!dbGuild || !isContentValid(message.content)) return;

    const member = await message.member;
    if (!member) return;

    // get percentage of sales
    let percentComission = getPercentComission(member, dbGuild);
    if (!percentComission) {
      percentComission = 0;
    }

    // monta o embed com as informações do membro
    const embed = await createEmbed({
      guild: message.guild!,
      title: "Relatório de vendas",
      description: `<@${message.author.id}>`,
      footer: {
        text: `${member.nickname ?? member.user.globalName}`,
        iconURL: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.jpg`,
      },
      timestamp: true,
    });
    if (!embed) return;

    let items = message.content
      .toLowerCase()
      .split("+")
      .map((operacao) => {
        let [quant, prefix, parceria] = operacao.trim().split(" ");

        // retorna se quantidade for número
        if (isNaN(parseInt(quant)) || parseInt(quant) <= 0) {
          isValid = false;
          return;
        }

        // verifica se tem parceria
        if (parceria && (parceria === "p" || parceria === "parceria")) {
          isPartnership = true;
        }

        // pega nome do item correto que inserido na mensagem ex: g3
        const itemKey = Object.keys(municao).find((key: string) =>
          municao[`${key}`].aliases.includes(prefix.trim())
        );

        // retorna se item for inválido ou não for encontrado
        if (!itemKey || itemKey == undefined) {
          isValid = false;
          return;
        }

        return { quant, itemKey };
      })
      .filter((items) => items !== undefined);

    // retorna se item inválido
    if (!isValid) {
      embed.addFields({
        name: "Erro",
        value: "Item inválido ou não encontrado.",
        inline: false,
      });
      await message.channel.send({ embeds: [embed] });
      return;
    }

    items.forEach((item) => {
      // pega item
      const muni = municao[item!.itemKey];

      // calcula o preço unitário
      const precoUnit: number = isPartnership ? muni.preco.parceria : muni.preco.normal;
      totalPrice += precoUnit * parseInt(item!.quant);

      embed.addFields(
        { name: "Nomeㅤㅤㅤㅤㅤㅤ", value: `\`\`\`${muni.nome}\`\`\``, inline: true },
        { name: "Quantidade", value: `\`\`\`${item!.quant}\`\`\``, inline: true },
        { name: "ㅤ", value: "ㅤ", inline: true }
      );
    });

    // cria embed com calculo de preço
    embed.addFields(
      { name: "Valor Venda", value: `\`\`\`${totalPrice}\`\`\``, inline: true },
      {
        name: "Valor Deposito",
        value: `\`\`\`${totalPrice - totalPrice * percentComission}\`\`\``,
        inline: true,
      },
      {
        name: "Parceria",
        value: `\`\`\`${isPartnership ? "Sim" : "Não"}\`\`\``,
        inline: true,
      }
    );

    const attachment = message.attachments.first();
    if (attachment) {
      embed.setImage(attachment.url);
    }

    // envia mensagem
    message.channel
      .send({
        embeds: [embed],
      })
      .then((msg) => {
        if (!items) return;
        message.delete();
      });
  } catch (error) {
    logger.message.error("Error ao executar salesReport.ts", "error");
  }
}

function isContentValid(content: string) {
  const contentArray = content.toLowerCase().split(" ");
  return contentArray.length < 0 || isNaN(parseInt(contentArray[0])) ? false : true;
}

function getPercentComission(
  member: GuildMember,
  dbGuild: Document<unknown, {}, IModelGuild> & IModelGuild & { _id: Types.ObjectId }
) {
  if (!dbGuild.salesRoles) return;

  let percentComission: number = 0;
  let rawPosition = 0;

  member.roles.cache.some((role) => {
    dbGuild.salesRoles!.forEach((roleParam) => {
      if (roleParam.id === role.id && role.rawPosition > rawPosition) {
        rawPosition = role.rawPosition;
        percentComission = roleParam.percent;
        return true;
      }
    });
  });

  return percentComission / 100;
}
