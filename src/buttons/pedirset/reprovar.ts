import { ButtonInteraction, EmbedBuilder, GuildMember } from "discord.js";
import { logger } from "../..";
import { verifyEntryRole } from "./pedirset";

export async function execute(interaction: ButtonInteraction) {
  try {
    if (!(await verifyEntryRole(interaction))) return;

    const embed = new EmbedBuilder(interaction.message.embeds[0]!.data);
    const target = await getTarget(interaction);
    const staff = await interaction.guild?.members.fetch(interaction.user.id);

    await setNickname(interaction, target, embed);

    embed
      .setTitle("ENTRADA REJEITADA")
      .setDescription(null)
      .setColor("Red")
      .setFooter({
        text: `Reprovado por: ${staff?.nickname ?? interaction.user.globalName}`,
        iconURL: staff?.displayAvatarURL(),
      });

    await interaction.update({
      embeds: [embed],
      components: [],
    });
  } catch (error) {
    logger.error("Error executing aprovar button interaction", error, 5, __filename);
  }
}

async function setNickname(
  interaction: ButtonInteraction,
  target: GuildMember,
  embed: EmbedBuilder
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      await target.setNickname(`Entrada Rejeitada | ${target.user.globalName}`);
      resolve(`Entrada Rejeitada | ${target.user.globalName}`);
    } catch (error) {
      embed
        .setTitle("MISSING PERMISSIONS")
        .setDescription(
          `O bot não possui **PERMISSÃO** para alterar o **APELIDO** do  usuário <@${target.user.id}>!`
        )
        .setColor("Yellow");
      await interaction.update({ embeds: [embed] });

      reject("Error setting nickname");
    }
  });
}

async function getTarget(interaction: ButtonInteraction): Promise<GuildMember> {
  return new Promise(async (resolve, reject) => {
    try {
      const targetId = interaction.message.content.replace("||<@", "").replace(">||", "");
      const target = await interaction.guild!.members.fetch(targetId);
      if (!target) throw new Error("Target not found");
      resolve(target);
    } catch (error) {
      const embed = new EmbedBuilder(interaction.message.embeds[0]!.data)
      .setTitle('ENTRADA REJEITADA')
      .setDescription('O usuário não foi encontrado na lista de membros do servidor.')
      .setColor('Red')

      await interaction.update({ embeds: [embed!], components: []})
      reject(error);
    }
  });
}
