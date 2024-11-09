import { ButtonInteraction, EmbedBuilder, GuildMember } from "discord.js";
import { ModelMember } from "../../models/modelMember";
import { verifyEntryRole } from "./pedirset";
import { database } from "../../services/database/database.service";
import { logger } from "../../..";
import { client } from "../../../connections/discord.connection";

export async function execute(interaction: ButtonInteraction) {
  try {
    if (!(await verifyEntryRole(interaction))) return;

    const embed = new EmbedBuilder(interaction.message.embeds[0]!.data);
    const target = await getTarget(interaction);
    const staff = await interaction.guild?.members.fetch(interaction.user.id);
    const recruiter = await getRecruiter(interaction)
    const guildDb = await database.getGuild(interaction.guildId!);

    console.log(recruiter)

    guildDb?.entryRoleId?.forEach(async (roleParam) => {
      setTimeout(async () => {
        const role = await interaction.guild?.roles.resolve(roleParam.id);
        if (!role) {
          embed
            .setTitle("CARGO ENTRY NÃO ENCONTRADO")
            .setDescription(
              `Não é possível concluir a interação!\nNão foi possível encontrar cargo <@&${roleParam.id}>.\nRemova o cargo usando o comando:\`\`\`/pedirset entrada del ${roleParam.id}\`\`\``
            )
            .setColor("Yellow");
          await interaction.update({ embeds: [embed] });

          throw new Error("Role not found");
        }

        try {
          await target.roles.add(role);
        } catch (error) {
          logger.error("Error adding role to member", error, 5, __filename);
          embed
            .setTitle("MISSING PERMISSIONS")
            .setDescription(
              `O bot não possui **PERMISSÃO** para adicionar o **CARGO** <@&${role.id}> ao usuário <@${target.user.id}>!`
            )
            .setColor("Yellow");
          await interaction.update({ embeds: [embed] });

          throw new Error("Missing permission to add role to member");
        }
      }, 1000);
    });

    guildDb?.entryRoleRemoveId?.forEach(async (roleParam) => {
      setTimeout(async () => {
        const role = await interaction.guild?.roles.resolve(roleParam.id);
        if (!role) {
          embed
            .setTitle("CARGO ENTRY NÃO ENCONTRADO")
            .setDescription(
              `Não é possível concluir a interação!\nNão foi possível encontrar cargo <@&${roleParam.id}>.\nRemova o cargo usando o comando:\`\`\`/pedirset remover del ${roleParam.id}\`\`\``
            )
            .setColor("Yellow");
          await interaction.update({ embeds: [embed] });

          throw new Error("Role not found");
        }

        try {
          await target.roles.remove(role);
        } catch (error) {
          logger.error("Error adding role to member", error, 5, __filename);
          embed
            .setTitle("MISSING PERMISSIONS")
            .setDescription(
              `O bot não possui **PERMISSÃO** para adicionar o **CARGO** <@&${role.id}> ao usuário <@${target.user.id}>!`
            )
            .setColor("Yellow");
          await interaction.update({ embeds: [embed] });

          throw new Error("Missing permission to add role to member");
        }
      }, 1000);
    });

    const nickname = await setNickname(interaction, target, embed).catch(err => err)

    if (nickname.length > 2) {
      embed
      .setTitle("ENTRADA APROVADA")
      .setDescription(null)
      .setColor("Green")
      .setFooter({
        text: `Aprovado por: ${staff?.nickname ?? interaction.user.globalName}`,
        iconURL: staff?.displayAvatarURL(),
      });
    }

    await createMemberInDatabase(interaction, target, nickname, staff!, recruiter);

    await interaction.update({
      embeds: [embed],
      components: [],
    });
  } catch (error) {
    logger.error("Error executing aprovar button interaction", error, 5, __filename);
  }
}

function getRecruiter(interaction: ButtonInteraction): Promise<GuildMember> {
  return new Promise(async (resolve, reject) => {
    try {
      const recruiterId = interaction.message.embeds[0].data.fields?.filter(data => data.name === "ID Recrutador")[0].value
      if (recruiterId?.includes('<@')) {
        const recruiter = await interaction.guild?.members.resolve(recruiterId.replace("<@", '').replace(">", ''))
        if (recruiter) {
          resolve(recruiter)
        }
      } 
      const clientMember = await interaction.guild?.members.resolve(client.user!.id)
      if (clientMember) {
        resolve(clientMember)
      }
      throw new Error("Error getting recruiter")
    } catch (error) {
      reject(error)
    }
  })
}


function createMemberInDatabase(
  interaction: ButtonInteraction,
  target: GuildMember,
  nickname: string[],
  staff: GuildMember,
  recruiter: GuildMember
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      let memberDb = await ModelMember.findOne({ guildId: interaction.guildId, memberId: target.id });

      if (!memberDb) {
        const dateUTC = new Date()
        const dateBRL = new Date(dateUTC.getTime() + (-180 * 60000))

        memberDb = new ModelMember({
          guildId: interaction.guildId,
          memberId: target.id,
          nickname: nickname[2] ?? target.user.globalName,
          nameIG: nickname[0],
          idIG: nickname[1],
          isOnDiscord: true,
          alreadyBanned: false,
          allowedBy: staff.id,
          recruiterId: recruiter.id,
          createdAt: dateBRL.getTime(),
        });
      } else {
        memberDb.nickname = nickname[2] ?? target.user.globalName;
        memberDb.nameIG = nickname[0];
        memberDb.idIG = nickname[1];
      }

      memberDb.save();
      logger.info("New Member successfully added to database");
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

async function setNickname(
  interaction: ButtonInteraction,
  target: GuildMember,
  embed: EmbedBuilder
): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    let name = interaction.message.embeds[0].fields.filter(
      (data) => data.name === "Nome"
    )[0].value;
    let gameId = interaction.message.embeds[0].fields.filter(
      (data) => data.name === "ID"
    )[0].value;
    const names = name.trim().split(" ");

    if (names.length > 1) {
      const firstName =
        names[0].charAt(0).toUpperCase() + names[0].slice(1).toLowerCase();
      const lastName = names[1].charAt(0).toUpperCase() + names[1].slice(1).toLowerCase();
      name = `${firstName} ${lastName}`;
    }

    const guildDb = await database.getGuild(interaction.guildId!);
    const prefixRole = guildDb?.prefix!;

    try {
      await target.setNickname(`${prefixRole} ${name} | ${gameId}`);
      resolve([name, gameId, `${prefixRole} ${name} | ${gameId}`]);
    } catch (error) {
      embed
        .setTitle("MISSING PERMISSIONS")
        .setDescription(
          `O bot não possui **PERMISSÃO** para alterar o **APELIDO** do  usuário <@${target.user.id}>!`
        )
        .setColor("Yellow");

      reject([name, gameId]);
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
        .setTitle("ENTRADA REJEITADA")
        .setDescription("O usuário não foi encontrado na lista de membros do servidor.")
        .setColor("Red");

      await interaction.update({ embeds: [embed!], components: [] });
      reject(error);
    }
  });
}
