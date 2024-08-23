import {
  EmbedBuilder,
  ModalSubmitInteraction,
  TextChannel
} from "discord.js";
import { logger } from "../..";
import { cache } from "../../cache/interaction";
import { createEmbed } from "../../utils/createEmbed";
import { getGuild } from "../../utils/getGuild";

export async function execute(interaction: ModalSubmitInteraction) {
  logger.init(__filename);
  try {

    // carrega dados da interação
    const quantity = await interaction.fields.getTextInputValue("quantity");
    const member = await interaction.fields.getTextInputValue("member");
    const reason = await interaction.fields.getTextInputValue("reason");

    // deleta cache e interação anterior
    delete cache[interaction.user.id];

    // carrega dados do banco de dados
    const guildDb = await getGuild(interaction.guildId!);
    if (!guildDb?.reportChestId)
      throw new Error("Couldnt find channel Report Chest in database");

    // cria embed do relatório de baú
    const embed = await createChestEmbed(
      interaction,
      quantity,
      member,
      reason
    );
    
    const channel = (await interaction.guild?.channels.resolve(
      guildDb.reportChestId
    )) as TextChannel;

    // envia relatório para o canal de relatórios
    await channel
      .send({
        content: `||<@${interaction.user.id}>||`,
        embeds: [embed],
      })
      // cria uma resposta com link para o relatório enviado
      .then(async (message) => {
        await interaction
          .reply({
            content: ``,
            embeds: [
              await createEmbed(
                interaction.guild!,
                "Relatório criado com sucesso!",
                `Confira os detalhes [aqui](${message.url}).`
              ),
            ],
            ephemeral: true,
          })
          // delete a resposta após 15 segundos
          .then((reply) => {
            setTimeout(() => {
              reply.delete().catch();
            }, 15000);
          });
      });
  } catch (error) {
    logger.error("Error executing modal submit", error, 5, __filename);
  }
}

async function createChestEmbed(
  interaction: ModalSubmitInteraction,
  quantity: string,
  target: string,
  reason: string
): Promise<EmbedBuilder> {
  return new Promise(async (resolve, reject) => {
    try {
      const member = await interaction.guild?.members.resolve(interaction.user.id)!;

      const title = "Relatório de Retirada";
      const description = "\`\`\`Coletes\`\`\`";
      const thumbnail = interaction.user.displayAvatarURL();
      const embed = await createEmbed(
        interaction.guild!,
        title,
        description,
        {
          text: `${member.nickname ?? member.user.globalName}`,
          iconURL: member.displayAvatarURL(),
        },
        thumbnail,
        true
      );

      embed.addFields(
        {
          name: "Nome",
          value: `\`\`\`Coletes\`\`\``,
          inline: true,
        },
        { name: "Quantidade", value: `\`\`\`${quantity}\`\`\``, inline: true },
        { name: "ID Membro", value: `\`\`\`${target}\`\`\``, inline: true },
        {
          name: "Motivo",
          value: `\`\`\`${reason.length != 0 ? reason : "Não especificado."}\`\`\``,
          inline: true,
        }
      );
      resolve(embed);
    } catch (error) {
      reject(error);
    }
  });
}
