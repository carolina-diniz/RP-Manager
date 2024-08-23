import {
  ChannelType,
  CommandInteraction,
  EmbedBuilder,
  GuildBasedChannel,
  GuildMember,
  SlashCommandBuilder,
  SlashCommandMentionableOption,
  SlashCommandStringOption,
  TextChannel,
} from "discord.js";
import { logger } from "../..";
import { banMember } from "../../utils/banMember";
import { getGuild } from "../../utils/getGuild";
import { verifyPermission } from "../../utils/verifyPermission";
import { verifyPremiumAccess } from "../../utils/verifyPremiumAccess";

export const data = new SlashCommandBuilder()
  .setName("pd")
  .setDescription("O comando banirá um membro do servidor.")
  .addMentionableOption(
    new SlashCommandMentionableOption()
      .setName("membro")
      .setDescription("Membro a ser banido")
      .setRequired(true)
  )
  .addStringOption(
    new SlashCommandStringOption()
      .setName("motivo")
      .setDescription("Motivo da punição")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  try {
    await interaction.deferReply({ ephemeral: true });
    if (
      !(await verifyPremiumAccess(interaction)) ||
      !(await verifyPermission(interaction, "BanMembers"))
    )
      return;

    const member = (await interaction.options.get("membro")!.member) as GuildMember;
    const staff = await interaction.guild!.members.resolve(interaction.user.id);
    const reason = await interaction.options.get("motivo")!.value;

    if (!member || !staff || !reason) {
      await interaction.editReply({ content: "Erro: Dados inválidos." });
      return;
    }

    await applyingBan(interaction, member, staff, reason);
  } catch (error) {
    const msg = `Error executing ${interaction.commandName} command`;
    const user = interaction.user
    logger.error(msg, error, 3, __filename, interaction.guild!, user);

    await interaction.editReply({
      content: `Error executing ${interaction.commandName} command`,
    });
  }
}

async function applyingBan(
  interaction: CommandInteraction,
  member: GuildMember,
  staff: GuildMember,
  reason: string | number | boolean
) {
  try {
    await interaction.editReply({ content: "Banindo membro..." });
    await banMember(member, staff, reason).catch((err) => {
      interaction.editReply({ content: `Error trying to ban <@${member.id}>` });
    });
    const channel = await createChannel(interaction);
    const embed = await createPdEmbed(member, staff, reason);
    if (!channel || !channel.isTextBased() || !embed) return null;

    await channel.send({
      content: `||<@${staff.id}>||`,
      embeds: [embed],
    });

    await interaction.editReply({
      content: `${member.nickname ?? member.user.globalName} foi banido com sucesso!`,
    });
  } catch (error) {
    logger.error(`Erro ao banir <@${member.id}>`, error, 5, __filename);
  }
}

async function createPdEmbed(
  member: GuildMember,
  staff: GuildMember,
  reason: string | number | boolean
) {
  let name = "";
  let id = "";

  const memberName = `${member.nickname ?? member.user.globalName}`;

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
      { name: "Quem aplicou", value: `<@${staff.id}>`, inline: true },
      { name: "Quem foi Banido", value: `<@${member.id}>`, inline: true }
    );

  return embed;
}

async function createChannel(
  interaction: CommandInteraction
): Promise<TextChannel | GuildBasedChannel | undefined> {
  return new Promise(async (resolve, reject) => {
    try {
      const guildDb = await getGuild(interaction.guildId!);
      if (!guildDb) return null;

      if (guildDb.pdChannelId) {
        const channel = await interaction.guild!.channels.cache.get(guildDb.pdChannelId);
        resolve(channel);
      } else {
        const channel = await interaction.guild!.channels.create({
          name: "🚫┃𝙿𝙳",
          nsfw: false,
          type: ChannelType.GuildText,
          position: 0,
          permissionOverwrites: [
            {
              id: interaction.guild!.roles.everyone.id,
              allow: [],
              deny: ["ViewChannel", "SendMessages"],
            },
          ],
        });
        if (!channel) throw new Error("Error creating channel");
        logger.info(`Channel ${channel.name} created successfully`);
        guildDb.pdChannelId = channel.id;
        await guildDb.save();
        resolve(channel);
      }
    } catch (error) {
      logger.error("Error creating pd channel", error, 5, __filename);
      reject(error);
    }
  });
}
