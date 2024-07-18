import {
  ButtonInteraction,
  ColorResolvable,
  EmbedBuilder,
  GuildMember,
  Role,
} from "discord.js";
import { ModelGuild } from "../../../../models/modelGuild";
import { ModelMember } from "../../../../models/modelMember";
import { createEmbed } from "../../../../util/createEmbed";
import { getTarget } from "../../../../util/getTarget";
import { logger } from "../../../../util/logger";

export async function execute(interaction: ButtonInteraction) {
  try {
    const dbGuild = await ModelGuild.findOne({ guildId: interaction.guildId });
    if (!dbGuild || !dbGuild.entryRoleId) {
      await entryRoleNotFound(interaction);
      return;
    }

    // Get current embed
    const embed = interaction.message.embeds[0];
    if (!embed) return;
    const newEmbed = new EmbedBuilder(embed.data);

    // Get target and staff
    const target = await getTarget(interaction.guild!, interaction.message.content);
    const staff: GuildMember | null = await interaction.guild!.members.resolve(
      interaction.user.id
    );

    if (!target || !staff) {
      await userNotFound(interaction, newEmbed);
      return;
    }

    // Get entry role
    const entryRoleId = dbGuild.entryRoleId;
    const entryRole: Role | null = await interaction.guild!.roles.resolve(entryRoleId);
    if (!entryRole) {
      await roleNotFound(interaction, newEmbed);
      return;
    }

    // Add Entry Role
    const ADDENTRYROLE = await addEntryRole(interaction, target, entryRole, newEmbed);
    if (!ADDENTRYROLE) return;

    // get target name
    const embedInfos: (string | undefined)[] = embed.fields.map((data) => {
      if (
        data.name === "Nome" ||
        data.name === "ID" ||
        data.name === "Recrutador" ||
        data.value != null ||
        data.value != undefined
      )
        return data.value;
    });


    // Set nickname
    const { nickname, recrutador } = await setNickname(interaction, target, newEmbed, embedInfos);
    if (!recrutador) return;

    // Success entry
    await successEntry(interaction, newEmbed, staff);

    interaction
      .update({
        embeds: [newEmbed],
        components: [],
      })
      .then(async () => {
        await addNewMemberDocument(interaction, target);
        await createRecruitmentDocument(interaction, target, recrutador);
      });
  } catch (error) {
    logger.error(__filename, `Error trying to aprove set^: ${error}`);
  }
}

async function createRecruitmentDocument(
  interaction: ButtonInteraction,
  target: GuildMember,
  recrutador: string
) {
  try {
    const dataAtual = new Date();
    const fusoHorario = -3;
    dataAtual.setHours(dataAtual.getHours() + fusoHorario);

    /*
    const dbRecruitment = new ModelRecruitment({
      guildId: interaction.guildId,
      staffRecruiterId: recrutador,
      recruitedId: target.id,
      createdAt: dataAtual,
    });

    await dbRecruitment
      .save()
      .then(() => logger.info("[database] new Recruitment created"))
      .catch((error: any) => logger.database.error(__filename, error));*/
  } catch (error) {
    logger.error(__filename, `Error creating recruitment document: ${error}`);
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

async function roleNotFound(interaction: ButtonInteraction, newEmbed: EmbedBuilder) {
  newEmbed
    .setTitle("CARGO ENTRY NÃO ENCONTRADO")
    .setDescription(
      "Não é possível concluir a interação, defina um cargo de entrada usando ```/setup entryRole id_do_cargo```"
    )
    .setColor("Yellow");
  await interaction.update({ embeds: [newEmbed] });
  logger.error(__filename, "Entry role not found");
}

async function missingPermissions(
  interaction: ButtonInteraction,
  newEmbed: EmbedBuilder,
  description: string,
  color: ColorResolvable
) {
  newEmbed.setTitle("MISSING PERMISSIONS").setDescription(description).setColor(color);
  await interaction.update({ embeds: [newEmbed] });
}

async function successEntry(
  interaction: ButtonInteraction,
  newEmbed: EmbedBuilder,
  staff: GuildMember
) {
  newEmbed
    .setTitle("ENTRADA APROVADA")
    .setDescription(null)
    .setColor("Green")
    .setFooter({
      text: `Aprovado por: ${staff.nickname ?? interaction.user.globalName}`,
      iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpg`,
    });
}

async function entryRoleNotFound(interaction: ButtonInteraction) {
  const embed = await createEmbed({
    guild: interaction.guild!,
    title: "Cargo de entrada não foi configurado.",
    description:
      "Para configurar o cargo de entrada, use o comando ` /setup entryRole id_do_cargo `",
    timestamp: true,
    footer: true,
  });
  interaction.reply({
    embeds: [embed!],
    ephemeral: true,
  });
  logger.error(__filename, "[database] Cargo de entrada não encontrado.");
}

async function setNickname(
  interaction: ButtonInteraction,
  target: GuildMember,
  newEmbed: EmbedBuilder,
  embedInfos: (string | undefined)[],
) {

  let name: string = embedInfos[0] ?? "nome";
  const gameId: string = embedInfos[1] ?? "id";
  const recrutador: string = embedInfos[3] ?? "recrutador";

  const names: string[] = name.trim().split(" ");
  if (names.length > 1) {
    const firstName: string = names[0];
    const initialLastName = names[1].charAt(0).toUpperCase() + ".";
    name = `${firstName} ${initialLastName}`;
  }

  // Set prefix Role
  const dbGuild = await ModelGuild.findOne({guildId: interaction.guildId!})
  const prefixRole = dbGuild!.prefix

  try {
    await target.setNickname(`${prefixRole} ${name} | ${gameId}`);
    return { nickname: target.nickname, recrutador};
  } catch (error) {
    const description = `O bot não possui permissão para alterar o NICKNAME do usuário!`;
    await missingPermissions(interaction, newEmbed, description, "Yellow");
    logger.warn(`Can't change nickname of ${target.user.tag}`);
    return { nickname: null, recrutador: null};
  }
}

async function addEntryRole(
  interaction: ButtonInteraction,
  target: GuildMember,
  entryRole: Role,
  newEmbed: EmbedBuilder
) {
  try {
    await target.roles.add(entryRole);
    logger.info(`Added role "${entryRole.name}" to ${target.user.tag}`);
    return true;
  } catch (error) {
    const description = `O bot não possui permissão para alterar informações o CARGO de <@${target.user.id}>!`;
    await missingPermissions(interaction, newEmbed, description, "Red");
    logger.error(
      __filename,
      `Can't add role "${entryRole.name}" to ${target.user.tag}: ${error}`
    );
    return null;
  }
}

async function addNewMemberDocument(interaction: ButtonInteraction, member: GuildMember) {
  try {
    const dbMember = await ModelMember.findOne({
      guildId: interaction.guild!.id,
      id: member.id,
    });

    if (dbMember) {
      dbMember.id = member.id;
      dbMember.IGName = null;
      dbMember.IGId = null;
      dbMember.nickname = null;
      dbMember.guildId = interaction.guild!.id;
      dbMember.user = {
        globalName: member.user.globalName,
        createdTimestamp: member.user.createdTimestamp,
        tag: member.user.tag,
        bot: member.user.bot,
        displayName: member.user.displayName,
        id: member.user.id,
        username: member.user.username,
      };
      dbMember.pd = {
        isPemaBanned: false,
        permaDeathReason: "",
        whoBanned: null,
      };
      dbMember.joinedAt = new Date();
      dbMember.leftAt = null;
      dbMember.save()

      logger.database.update(
        `[${interaction.guild?.name}] Member infos updated to database <${
          member.nickname ?? member.user.username
        }>`
      );

    } else {
      const newDbMember = new ModelMember({
        id: member.id,
        IGName: null,
        IGId: null,
        nickname: null,
        guildId: interaction.guild!.id,
        user: {
          globalName: member.user.globalName,
          createdTimestamp: member.user.createdTimestamp,
          tag: member.user.tag,
          bot: member.user.bot,
          displayName: member.user.displayName,
          id: member.user.id,
          username: member.user.username,
        },
        pd: {
          isPemaBanned: false,
          permaDeathReason: ".",
          whoBanned: null,
        },
        joinedAt: new Date(),
        leftAt: null,
      })
      newDbMember.save();
      logger.database.create(
        `[${interaction.guild?.name}] New member add to database <${
          member.nickname ?? member.user.username
        }>`
      );
    }
  } catch (error) {
    logger.database.error(__filename, error);
  }
}
