import { Message } from "discord.js";
import { logger } from "../..";
import { ModelGuild } from "../../models/modelGuild";
import { ModelSales } from "../../models/modelSales";
import { createEmbed } from "../../utils/createEmbed";
import { getGuild } from "../../utils/getGuild";
import { municao } from "./table";

export function relatorioVendaMessage(message: Message): Promise<void> {
  logger.init(__filename);
  return new Promise(async (resolve, reject) => {
    try {
      if (!(await isContentValid(message))) return;

      const percentComission = (await getPercentComission(message)) ?? 0;
      let isValid = true;
      let isPartnership = false;
      let totalPrice = 0;

      const embed = await createEmbed(
        message.guild!,
        `Relatório de Vendas`,
        `<@${message.author.id}>`,
        {
          text: `Vendedor: ${message.member?.nickname ?? message.author.globalName}`,
          iconURL: message.author.displayAvatarURL(),
        },
        false,
        true
      );

      let items = message.content
        .toLowerCase()
        .split("+")
        .map((operacao) => {
          let [quant, prefix, parceria] = operacao
            .trim()
            .split(" ")
            .filter((word) => word.trim().length != 0);

          if (isNaN(parseInt(quant)) || parseInt(quant) <= 0) {
            isValid = false;
            return;
          }

          if (parceria && (parceria.includes('p'))) {
            isPartnership = true;
          }

          // pega o nome do item correto que está inserido na mensagem ex: g3
          const itemKey = Object.keys(municao).find((key: string) =>
            municao[key].aliases.includes(prefix.trim())
          );

          // retorna se item for inválido ou não for encontrado
          if (!itemKey || itemKey == undefined) {
            isValid = false;
            return;
          }

          const quantNumber = parseInt(quant);

          // retorna items
          return { quant: quantNumber, itemKey };
        })
        .filter((items) => items !== undefined);

      if (!isValid) {
        embed.addFields({
          name: "Error",
          value: "Item inválido ou não encontrado.",
          inline: false,
        });
        await message.channel.send({ embeds: [embed] });
        return;
      }

      items.forEach((item) => {
        const muni = municao[item.itemKey];

        // calcula o preço unitário
        const precoUnit = isPartnership ? muni.preco.parceria : muni.preco.normal;
        totalPrice += precoUnit * item!.quant;

        embed.addFields(
          { name: "Nomeㅤㅤㅤㅤㅤㅤ", value: `\`\`\`${muni.nome}\`\`\``, inline: true },
          { name: "Quantidade", value: `\`\`\`${item!.quant}\`\`\``, inline: true },
          { name: "ㅤ", value: "ㅤ", inline: true }
        );
      });

      // cria embed com calculo do preço
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

      const isPremium = await ModelGuild.findOne({ guildId: message.guildId })
       .then((guild) => { if (guild) return guild.premium })

      const noPremiumEmbed = await createEmbed(
        message.guild!,
        "No Premium Access!",
        "Parece que seu premium acabou :'c, para continuar com os benefícios, entre em contato com @kaworii21."
      )

      message.channel
        .send({
          content: `||<@${message.author.id}>||`,
          embeds: isPremium ? [embed]:[embed, noPremiumEmbed] ,
        })
        .then(async (messageSent) => {
          if (!items) return;

          await createSaleInDatase(
            messageSent,
            message,
            items,
            totalPrice,
            isPartnership,
            percentComission
          );
          message.delete();
        });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function createSaleInDatase(
  messageSent: Message,
  message: Message,
  items: { itemKey: string; quant: number }[],
  saleValor: number,
  partnership: boolean,
  percent: number
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const dateUTC = new Date()
      const dateBRL = new Date(dateUTC.getTime() + (-180 * 60000))

      const salesDb = new ModelSales({
        guildId: messageSent.guildId,
        messageId: messageSent.id,
        memberId: message.author.id,
        items,
        saleValor,
        depositValor: saleValor - saleValor * percent,
        partnership,
        percent,
        createAt: dateBRL.getTime(),
      });

      salesDb.save()
      logger.info("New sale successfully created");
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function isContentValid(message: Message): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const contentWords = message.content
        .toLowerCase()
        .split(" ")
        .filter((word) => word.trim().length != 0);
      if (isNaN(parseInt(contentWords[0])))
        throw new Error(
          `Mensagem (${message.content}) não começa com um número, então não pode ser um relatório de venda.`
        );
      if (contentWords.length < 2)
        throw new Error(
          `Mensagem (${message.content})  não possui caracteres mínimos para ser relatório de venda.`
        );
      resolve(true);
    } catch (error) {
      logger.error("[AVISO!] ", error, 5, __filename);
      reject(error);
    }
  });
}

function getPercentComission(message: Message): Promise<number> {
  return new Promise(async (resolve, reject) => {
    try {
      const guildDb = await getGuild(message.guildId!);
      let percentComission = 0;
      let rawPosition = 0;

      message.member?.roles.cache.some((role) => {
        guildDb?.reportSalesRolesId?.forEach((roleParam) => {
          if (roleParam.id === role.id && role.rawPosition > rawPosition) {
            rawPosition = role.rawPosition;
            percentComission = roleParam.percent;
            return true;
          }
        });
      });

      resolve(percentComission / 100);
    } catch (error) {
      reject(error);
    }
  });
}
