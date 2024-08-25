import MercadoPagoConfig, { Payment } from "mercadopago";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types";
import { client } from "..";
import { cache } from "../cache/interaction";
import { PaymentBody } from "../interfaces/paymentBody";
import { createEmbed } from "../utils/createEmbed";
import { getGuild } from "../utils/getGuild";

export class PaymentMercadoPago {
  private payment?: Payment;
  private max_minutes_to_expiration: number = 15;

  constructor(accessToken: string) {
    const client = new MercadoPagoConfig({
      accessToken,
    });
    this.payment = new Payment(client);
  }

  async create(data: PaymentBody): Promise<PaymentResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        const body: PaymentCreateRequest = {
          transaction_amount: data.price,
          description: data.description,
          payment_method_id: "pix",
          date_of_expiration: new Date(
            new Date().getTime() + this.max_minutes_to_expiration * 60 * 1000
          ).toISOString(),
          metadata: {
            guildId: data.guildId,
            channelId: data.channelId,
            memberId: data.memberId,
            createdAt: new Date().toISOString(),
          },
          payer: {
            email: data.email,
          },
        };
        const paymentResponse = await this.payment!.create({ body });
        console.log("Payment created", paymentResponse.id!);
        resolve(paymentResponse);
      } catch (error) {
        console.error("Error creating payment", error);
        reject(error);
      }
    });
  }

  async verifyPayment(paymentId: number): Promise<void> {
    console.log("Verifying payment");

    let counter = 0;
    const maxcounter = this.max_minutes_to_expiration * 2 + 1;

    const checkPaymentStatus = async () => {
      counter++;
      console.log(`${counter} tryes to verify payment ${paymentId}`);

      const response = await this.payment?.get({ id: paymentId });
      const expirationDate = new Date(response?.date_of_expiration!);

      if (response?.status === "approved") {
        console.log("Payment approved!");
        await this.paymentAproved(response);
        return true;
      }

      if (["pending", "in_process", "in_mediation"].includes(response?.status!)) {
        console.log("status: ", response?.status);
        console.log("status_detail: ", response?.status_detail);
      }

      if (
        response?.status === "rejected" ||
        response?.status === "cancelled" ||
        response?.status === "refunded"
      ) {
        console.log("Payment rejected!");
        console.log("status: ", response?.status);
        console.log("status_detail: ", response?.status_detail);
        return;
      }

      if (Date.now() > expirationDate.getTime()) {
        console.log("Payment expired!");
        console.log("status: ", response?.status);
        console.log("status_detail: ", response?.status_detail);
        return;
      }

      if (counter > maxcounter) {
        console.log("Counter riched max number, no response!");
        console.log("status: ", response?.status);
        console.log("status_detail: ", response?.status_detail);
        return;
      }

      setTimeout(checkPaymentStatus, 30 * 1000);
    };

    checkPaymentStatus();
  }

  private async paymentAproved(
    paymentReponse: PaymentResponse | undefined
  ): Promise<void> {
    console.log("Payment approved!");

    try {
      const guild = await client.guilds.resolve(paymentReponse?.metadata.guild_id);
      const channel = await guild.channels.resolve(paymentReponse?.metadata.channel_id);
      const member = await guild.members.fetch(paymentReponse?.metadata.member_id);

      const title = "Pagamento Aprovado!";
      const description = `Parabéns ${
        member?.nickname ?? member?.user.globalName
      }! O pagamento de ${paymentReponse?.transaction_amount?.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })} foi aprovado com sucesso.
Agora você tem acesso total aos recursos do RP Manager para o seu servidor de GTA RP. Aproveite e crie uma experiência incrível para os seus jogadores! 🎮🚀`;
      const footer = { text: "RP Manager", iconURL: client.user!.displayAvatarURL() };
      const thumbnail = "https://cdn.discordapp.com/emojis/884010019543212053.gif";

      const embed = await createEmbed(guild, title, description, footer, thumbnail, true);

      const guildDb = await getGuild(guild.id);
      if (!guildDb) throw new Error("Guild not found");

      const dateNow = new Date();
      let date_addition = 0;

      if (guildDb.payment.expiration) {
        const dateExpiration = new Date(guildDb.payment.expiration);
        if (dateExpiration.getTime() > dateNow.getTime()) {
          date_addition = Math.abs(dateExpiration.getTime() - dateNow.getTime());
          console.log("date_addition", date_addition);
        }
      }

      guildDb.payment.lastPayment = dateNow.toISOString();

      const dateExpiration = ajustarDiaProximoMes(
        new Date(dateNow.getTime() + date_addition)
      );

      function ajustarDiaProximoMes(data: Date) {
        const ano = data.getFullYear();
        const mes = data.getMonth();
        const dia = data.getDate();

        // Calcula o próximo mês e ano, já considerando o caso de dezembro
        const proximoMes = (mes + 1) % 12;
        const proximoAno = mes === 11 ? ano + 1 : ano;

        // Cria uma data temporária com o mesmo dia no próximo mês
        const novaData = new Date(proximoAno, proximoMes, dia);

        // Verifica se o dia foi ajustado para o mês seguinte
        // (ex: 31 de março viraria 3 de abril)
        if (novaData.getDate() !== dia) {
          // Se o dia foi ajustado, significa que o próximo mês
          // não tem o mesmo dia, então volta para o último dia do mês atual
          novaData.setDate(0); // Definir o dia como 0 retorna ao último dia do mês anterior
        }

        return novaData;
      }

      guildDb.payment.expiration = dateExpiration.toISOString();

      guildDb.premium = true;

      await guildDb?.save();

      if (channel.isTextBased()) {
        channel
          .send({ embeds: [embed] })
          .then(() => console.log("Payment response sent to Discord channel"));
      }

      const cachedPayment = cache.payments[`${paymentReponse?.id!}`];
      console.log(cachedPayment);
      if (cachedPayment) {
        if (cachedPayment.type === "qrcode" && channel.isTextBased()) {
          const message = await channel.messages.resolve(cachedPayment.message_id);
          const interaction = await channel.messages.resolve(
            cachedPayment.interaction_id
          );
          message.delete().catch(console.error);
          interaction.delete().catch(console.error);
          delete cache.payments[`${paymentReponse?.id!}`];
        }
        if (cachedPayment.type === "link" && channel.isTextBased()) {
          const interaction = await channel.messages.resolve(
            cachedPayment.interaction_id
          );
          interaction.delete().catch(console.error);
          delete cache.payments[`${paymentReponse?.id!}`];
        }
      }
    } catch (error) {
      console.error("Error sending payment response to Discord channel", error);
    }
  }
}
