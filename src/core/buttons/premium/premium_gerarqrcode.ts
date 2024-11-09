import { ButtonInteraction, EmbedBuilder } from "discord.js";
import "dotenv/config";
import * as fs from "fs";
import { logger } from "../../..";
import { PaymentMercadoPago } from "../../../classes/payment";
import { createEmbed } from "../../../utils/createEmbed";
import { cache } from "../../../cache/interaction";

export async function execute(interaction: ButtonInteraction) {
  logger.init({filePath: __filename});
  try {
    const embed = new EmbedBuilder(interaction.message.embeds[0]!.data);

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

    const imagemBase64 =
      paymentRequest.point_of_interaction?.transaction_data?.qr_code_base64!;

    const bufferImage = Buffer.from(imagemBase64, "base64");

    const nomeArquivoTemp = "temp.png";

    fs.writeFileSync(nomeArquivoTemp, bufferImage);

    const time_to_expiration = new Date(paymentRequest.date_of_expiration!);
    const newEmbed = await createEmbed(
      interaction.guild!,
      "QR Code",
      `Este QR Code estará disponível por mais <t:${Math.floor(
        time_to_expiration.getTime() / 1000
      )}:R>. Após esse período, ele deixará de funcionar e não redirecionará mais para o link associado.`,
      false,
      false,
      true
    );

    newEmbed.setImage(`attachment://${nomeArquivoTemp}`);

    await interaction
      .update({ embeds: [embed], components: [] })
      .then((interactionResponse) => {
        const time_difference = time_to_expiration.getTime() - new Date().getTime();
        setTimeout(
          async () => {
            await interactionResponse.delete();
          },
          time_difference > 0 ? time_difference : 0
        );
      });

    await interaction
      .channel!.send({
        embeds: [newEmbed],
        files: [nomeArquivoTemp],
      })
      .then((message) => {
        const paymentId = paymentRequest.id!;

        if (!cache["payments"]) {
          cache["payments"] = {};
          cache.payments[paymentId] = {
            type: "qrcode",
            interaction_id: interaction.message.id,
            message_id: message.id,
          };
          console.log(cache);
        } else {
          cache.payments[paymentId] = {
            type: "qrcode",
            interaction_id: interaction.message.id,
            message_id: message.id,
          };
          console.log(cache);
        }

        payment.verifyPayment(paymentId);

        const time_difference = time_to_expiration.getTime() - new Date().getTime();
        setTimeout(
          async () => {
            await message.delete().catch(console.error);
          },
          time_difference > 0 ? time_difference : 0
        );
      });

    console.log("atualizado");
    fs.unlinkSync(nomeArquivoTemp);
  } catch (error) {
    logger.error(
      `Error executing ${interaction.customId} button interaction`,
      error,
      5,
      __filename
    );
  }
}
