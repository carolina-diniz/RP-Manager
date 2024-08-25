import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
} from "discord.js";
import "dotenv/config";
import { logger } from "../..";
import { cache } from "../../cache/interaction";
import { PaymentMercadoPago } from "../../classes/payment";

export async function execute(interaction: ButtonInteraction) {
  logger.init(__filename, 5, interaction.guild!);
  try {
    const price = parseFloat(process.env.premiumPrice!);
    const payment = new PaymentMercadoPago(process.env.accessToken!);
    const paymentRequest = await payment.create({
      description: "Premium RP Manager",
      email: "caroldinizc21@gmail.com",
      price: price,
      channelId: interaction.channelId!,
      guildId: interaction.guildId!,
      memberId: interaction.member?.user.id!,
    });

    const gerarLinkButton = new ButtonBuilder()
      .setURL(paymentRequest.point_of_interaction?.transaction_data?.ticket_url!)
      .setLabel("Link Mercado Pago (Pix)")
      .setStyle(ButtonStyle.Link)
      .setEmoji("🔗");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(gerarLinkButton);

    await interaction.update({ components: [row] }).then((interactionResponse) => {
      const paymentId = paymentRequest.id!;

      console.log(cache);

      if (!cache["payments"]) {
        cache["payments"] = {};
        cache.payments[paymentId] = {
          type: "link",
          interaction_id: interaction.message.id,
        };
        console.log(cache);
      } else {
        cache.payments[paymentId] = {
          type: "link",
          interaction_id: interaction.message.id,
        };
        console.log(cache);
      }

      payment.verifyPayment(paymentRequest.id!);

      const time_to_expiration = new Date(paymentRequest.date_of_expiration!);
      const time_difference = time_to_expiration.getTime() - new Date().getTime();
      setTimeout(
        async () => {
          await interactionResponse.delete().catch(console.error);
        },
        time_difference > 0 ? time_difference : 0
      );
    });
  } catch (error) {
    logger.error(
      `Error executing ${interaction.customId} button interaction`,
      error,
      5,
      __filename
    );
  }
}
