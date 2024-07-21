import { EmbedBuilder } from "@discordjs/builders";
import {
  Client,
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  SlashCommandMentionableOption,
  SlashCommandStringOption
} from "discord.js";
import { logger } from "../../events/on-InteractionCreate/onInteractionCreate";
import { verifyPremiumAccess } from "../../util/verifyPremiumAccess";

export const data = new SlashCommandBuilder()
  .setName("pd")
  .setDescription("Dá PD em um membro da fac.")
  .addMentionableOption(
    new SlashCommandMentionableOption()
      .setName("membro")
      .setDescription("Membro para ser banido.")
      .setRequired(true)
  )
  .addStringOption(
    new SlashCommandStringOption()
      .setName("motivo")
      .setDescription("Descreva o motivo para o PD do membro.")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction, client: Client) {
  try {
    await interaction.deferReply({ ephemeral: true });

    const isPremium = await verifyPremiumAccess(interaction);
    if (!isPremium) throw new Error("Este servidor não possui premium!");

    const guild = await interaction.guild;
    const staff = guild?.members.resolve(interaction.user.id);
    if (!staff || !guild) throw new Error("Guild or user staff not found");

    if (!staff.permissions.has("BanMembers")) {
      await interaction.editReply("Você não tem permissão para banir um membro!");
      return;
    }

    const data = interaction.options.data;
    const memberData = data[0].user;
    const reason: string = `${data[1].value}`;

    if (!memberData || !reason) {
      await interaction.editReply("Você precisa especificar um membro e um motivo!");
      return;
    }

    const member = await guild.members.resolve(memberData.id);
    if (!member) {
      await interaction.editReply("Membro não encontrado!");
      return;
    }

    await banMember(member, staff, reason);

    const embed = await createEmbed(member, reason, staff.id);

    interaction.editReply({
      content: `Usuário <@${member.id}> banido com sucesso!`,
      embeds: [embed!]
    });
  } catch (error) {
    logger.command.error("Error ao executar pd.ts", error);
  }
}

async function banMember(member: GuildMember, staff: GuildMember, reason: string) {
  try {
    await member
      .ban({
        reason: `---- 
COMANDO: PD 
----- 
BANIDO POR: 
${staff.nickname ? staff.nickname : staff.user.globalName} <@${staff.id}> 
----- 
MOTIVO: 
${reason}`,
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
}

function createEmbed(member: GuildMember, reason: string, staffId: string): EmbedBuilder {
  let name = "";
  let id = "";

  const memberName = `${
    member.nickname ? member.nickname : member.user.globalName
  }`.split("|");

  if (memberName.length == 2) {
    name = memberName[0].trim();
    id = memberName[1].trim();
  } else if (memberName.length == 3) {
    name = memberName[1].trim();
    id = memberName[2].trim();
  } else {
    name = member.nickname ? member.nickname : member.user.globalName || "";
    id = "Not found";
  }

  const embed = new EmbedBuilder()
    .setTitle("PD APLICADO")
    .addFields(
      { name: "Nome", value: `\`\`\`${name}\`\`\``, inline: true },
      { name: "ID", value: `\`\`\`${id}\`\`\``, inline: true },
      { name: "Motivo", value: `\`\`\`${reason}\`\`\``, inline: false },
      { name: "Quem aplicou", value: `<@${staffId}>`, inline: true },
      { name: "Quem foi Banido", value: `<@${member.id}>`, inline: true }
    );

  return embed;
}
