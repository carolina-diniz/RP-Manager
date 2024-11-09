import {
  CommandInteraction,
  GuildMember,
  PermissionResolvable,
  SlashCommandBuilder,
  SlashCommandMentionableOption,
  SlashCommandStringOption,
} from "discord.js";
import { logger } from "../../..";
import { verifyPermission } from "../../services/verify-permission/verifyPermission";

export const data = new SlashCommandBuilder()
  .setName("pd")
  .setDescription("Bane usuário do servidor. (premium)")
  .addMentionableOption(
    new SlashCommandMentionableOption()
      .setName("usuário")
      .setDescription("Usuário a ser banido.")
      .setRequired(true)
  )
  .addStringOption(
    new SlashCommandStringOption()
      .setName("motivo")
      .setDescription("Motivo do banimento.")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  try {
    logger.init({ filePath: __filename });
    await interaction.deferReply({ ephemeral: true });

    // Verifica se o usuário tem permissão para executar o comando
    await checkPermissions({ interaction, permission: "BanMembers" });

    // Pega o membro a ser banido, o motivo e o membro da equipe que está banindo
    const member = interaction.options.get("usuário")?.member as GuildMember;
    const reason = interaction.options.get("motivo")?.value as string;
    const staffMember = interaction.guild?.members.resolve(interaction.user.id);

    // Verifica se o usuário, membro da equipe e motivo foram informados
    if (!member) {
      await interaction.editReply({ content: "Usuário não encontrado." });
      return;
    } else if (!staffMember) {
      await interaction.editReply({ content: "Membro da equipe não encontrado." });
      return;
    } else if (!reason) {
      await interaction.editReply({ content: "Motivo não encontrado." });
      return;
    }

    // Bane o usuário
    await member.ban({ reason });

    // Envia a mensagem de confirmação
    await interaction.editReply({
      content: `Usuário \`${member.displayName}\` banido com sucesso.`,
    });
  } catch (error) {
    // Envia mensagem de erro
    const { commandName, user } = interaction;
    const errorMessage =
      `Error executing ${commandName} command` +
      `${
        error instanceof Error ? `\nError: \`\`\`powershell\n${error.message}\`\`\`` : ""
      }`;
    logger.error(errorMessage, error, 3, __filename, interaction.guild!, user);
    await interaction.editReply({ content: errorMessage });
  }
}

// Verifica se o usuário tem permissão para executar o comando
async function checkPermissions({
  interaction,
  permission,
}: {
  interaction: CommandInteraction;
  permission: PermissionResolvable;
}): Promise<unknown> {
  try {
    await verifyPermission(interaction, permission);
    //await verifyPremiumAccess(interaction);
    return true;
  } catch (error) {
    return error;
  }
}
