import { ButtonInteraction, ColorResolvable, EmbedBuilder, GuildMember } from "discord.js";
import { getTarget } from "../../../../util/getTarget";
import { logger } from "../../../../util/logger";

export async function execute(interaction: ButtonInteraction) {
  try {
    const embed = interaction.message.embeds[0];
    if (!embed) return;

    const newEmbed = new EmbedBuilder(embed.data);

    // Get target and staff
    const target = await getTarget(interaction.guild!, interaction.message.content);
    const staff: GuildMember | null = await interaction.guild!.members.resolve(
      interaction.user.id
    );

    // Caso não encontre o target ou staff
    if (!target || !staff) {
      await userNotFound(interaction, newEmbed);
      return;
    }

    // Remove roles
    await removeRoles(interaction, target, newEmbed)

    // Set nickname
    await setNickname(interaction, target, newEmbed)

    newEmbed
      .setTitle("ENTRADA REJEITADA")
      .setDescription(null)
      .setColor("Red")
      .setFooter({
        text: `Reprovado por: ${staff.nickname ?? staff.user.globalName}`,
        iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpg`,
      });

    interaction.update({
      embeds: [newEmbed],
      components: [],
    });
  } catch (error) {
    logger.error(__filename, error);
  }
}

async function userNotFound(interaction: ButtonInteraction, newEmbed: EmbedBuilder) {
  newEmbed
    .setTitle("USUÁRIO NÃO ENCONTRADO")
    .setDescription("`O usuário não foi encontrado na lista de membros do servidor.`")
    .setColor("Red");
  await interaction.update({ embeds: [newEmbed], components: [] });
  logger.error(__filename, "User not found");
}

async function missingPermissions(
  interaction: ButtonInteraction,
  newEmbed: EmbedBuilder,
  description: string,
  color: ColorResolvable,
) {
  newEmbed.setTitle("MISSING PERMISSIONS").setDescription(description).setColor(color);
  await interaction.update({ embeds: [newEmbed] });
}

async function setNickname(interaction: ButtonInteraction, target: GuildMember, newEmbed: EmbedBuilder) {
  try {
    await target.setNickname(`ENTRADA REJEITADA - ${target.user.tag}`);
  } catch (error) {
    const description = `O bot não possui permissão para alterar o NICKNAME do usuário!`

    await missingPermissions(interaction, newEmbed, description, 'Yellow');
    logger.warn(`Can't change nickname of ${target.user.tag}`);
    return;
  }
}

async function removeRoles(interaction: ButtonInteraction, target: GuildMember, newEmbed: EmbedBuilder) {
  try {
    await target.roles.set([]);
    logger.info(`Removed all roles from ${target.nickname}`);
  } catch (error) {
    const description = `O bot não possui permissão para remover os CARGOS de <@${target.nickname}>!`;
    
    await missingPermissions(interaction, newEmbed, description, 'Red');
    logger.error(`${__filename} Can't remove all roles from ${target.nickname}`, error);
    return;
  }
}