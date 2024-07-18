import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalSubmitInteraction,
} from "discord.js";
import { ModelGuild } from "../../../../models/modelGuild";
import { createEmbed } from "../../../../util/createEmbed";
import { logger } from "../../../../util/logger";

export async function execute(interaction: ModalSubmitInteraction) {
  try {
    const dbGuild = await ModelGuild.findOne({ guildId: interaction.guildId });
    if (!dbGuild || !dbGuild.aprovarsetChannelId) return;

    const nameInput: string = interaction.fields.getTextInputValue("entrada_name_input");
    const idInput: string = interaction.fields.getTextInputValue("entrada_id_input");
    const telefoneInput: string = interaction.fields.getTextInputValue(
      "entrada_telefone_input"
    );
    const recrutadorInput: string = interaction.fields.getTextInputValue(
      "entrada_recrutador_input"
    );

    const embed = await createEmbed({
      guild: interaction.guild!,
      title: "AGUARDANDO APROVAÇÃO",
      thumbnail: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpg`,
      footer: true,
      timestamp: true,
    });

    embed!.setFields([
      { name: "Nome", value: nameInput, inline: false },
      { name: "ID", value: idInput, inline: false },
      { name: "Celular", value: telefoneInput, inline: false },
      { name: "Recrutador", value: recrutadorInput, inline: false },
    ]);

    const aprovar: ButtonBuilder = new ButtonBuilder()
      .setCustomId("aprovar")
      .setLabel("Aprovar")
      .setEmoji({ name: "✅" })
      .setStyle(ButtonStyle.Success);

    const reprovar: ButtonBuilder = new ButtonBuilder()
      .setCustomId("reprovar")
      .setLabel("Reprovar")
      .setEmoji({ name: "✖️" })
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(aprovar, reprovar);

    const channel = await interaction.guild?.channels.resolve(
      dbGuild.aprovarsetChannelId!
    );
    if (!channel || !channel.isTextBased()) return;

    await channel
      .send({
        content: `||<@${interaction.user.id}>||`,
        embeds: [embed!],
        components: [row!],
      })
      .then(async () => {
        await sendReplyMessage(interaction);
      });
  } catch (error) {
    logger.error(__filename, error);
  }
}

async function sendReplyMessage(interaction: ModalSubmitInteraction) {
  const timeout: number = 30000;

  const embed = await createEmbed({
    title: "Sua solicitação foi recebida com sucesso!",
    description: `Por favor, aguarde um momento!\n
Seu pedido será avaliado por um moderador e seu acesso será liberado em breve.\n\n
Mensagem deletada <t:${Math.floor((Date.now() + timeout) / 1000)}:R>.`,
    footer: true,
    guild: interaction.guild!,
  });
  if (!embed) return;

  interaction
    .reply({
      embeds: [embed],
      ephemeral: true,
    })
    .then((msg) => {
      setTimeout(() => {
        msg.delete().catch((err) => logger.error(__filename, err));
      }, timeout);
    })
    .catch((err) => logger.error(__filename, err));
}
