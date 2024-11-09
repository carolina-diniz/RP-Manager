import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
  ModalSubmitInteraction,
} from "discord.js";
import { ModelMember } from "../../models/modelMember";
import { createEmbed } from "../../../utils/createEmbed";
import { database } from "../../services/database/database.service";
import { logger } from "../../..";

export async function execute(interaction: ModalSubmitInteraction) {
  try {
    const nameInput = interaction.fields.getTextInputValue("pedirset-name-input");
    const idInput = interaction.fields.getTextInputValue("pedirset-id-input");
    const phoneInput = interaction.fields.getTextInputValue("pedirset-phone-input");
    const recruiterId = interaction.fields.getTextInputValue("pedirset-recruiter-input");

    const recruiter = await getRecruiter(interaction, recruiterId)

    const embed = await createEmbed(
      interaction.guild!,
      "AGUARDANDO APROVAÇÃO",
      undefined,
      true,
      await interaction.user.displayAvatarURL(),
      true
    );
    
    embed.setFields([
      { name: "Nome", value: nameInput, inline: false },
      { name: "ID", value: idInput, inline: false },
      { name: "Celular", value: phoneInput, inline: false },
      { name: "ID Recrutador", value: recruiter ? `<@${recruiter.id}>`: recruiterId, inline: false },
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
    const guildDb = await database.getGuild(interaction.guildId!);
    const channel = await interaction.guild?.channels.resolve(
      guildDb?.aprovarsetChannelId!
    );

    if (!channel || !channel.isTextBased())
      throw new Error("Channel is not text based or doesnt exist");

    await channel
      .send({
        content: `||<@${interaction.user.id}>||`,
        embeds: [embed!],
        components: [row],
      })
      .then(async () => {
        await sendReplyMessage(interaction);
      });
  } catch (error) {
    logger.error("Error executing modalSubmit pedirset", error, 5, __filename);
    await interaction.editReply({ content: "Error executing modalSubmit pedirset" });
  }
}

function getRecruiter(interaction: ModalSubmitInteraction, recruiterId: string): Promise<GuildMember | null> {
  return new Promise(async (resolve, reject) => {
    try {
      if (isNaN(parseInt(recruiterId))) resolve(null)

      const memberDb = await ModelMember.findOne({
        guildId: interaction.guildId,
        idIG: recruiterId,
      });

      if (!memberDb) resolve(null)

      const member = await interaction.guild!.members.resolve(memberDb!.memberId!);

      if (!member) resolve(null)
        
      resolve(member as GuildMember);
    } catch (error) {
      reject(error);
    }
  })
}

async function sendReplyMessage(interaction: ModalSubmitInteraction) {
  const timeout: number = 30000;

  const embed = await createEmbed(
    interaction.guild!,
    "Sua solicitação foi recebida com sucesso!",
    `Por favor, aguarde um momento!\n
Seu pedido será avaliado por um moderador e seu acesso será liberado em breve.\n\n
Mensagem deletada <t:${Math.floor((Date.now() + timeout) / 1000)}:R>.`,
    true,
    true
  );

  interaction
    .reply({
      embeds: [embed!],
      ephemeral: true,
    })
    .then((msg) => {
      setTimeout(() => {
        msg.delete();
      }, timeout);
    });
}
