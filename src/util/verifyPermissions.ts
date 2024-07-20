import { ButtonInteraction, CommandInteraction, PermissionResolvable } from "discord.js";
import { logger } from "../events/on-InteractionCreate/onInteractionCreate";
import { createEmbed } from "./createEmbed";

export async function verifyPermissions(
  interaction: CommandInteraction | ButtonInteraction,
  permission: PermissionResolvable
) {
  try {
    logger.system.info("verificando permissão de acesso...");

    const staff = await interaction.guild?.members.resolve(interaction.user.id);
    if (!staff) {
      throw new Error(`Usuário não é um membro do servidor ${interaction.guild!.name}`);
    }

    if (!staff.permissions.has(permission)) {
      logger.system.warn(
        `acesso negado! usuário não possui permissão para executar este comando!`
      );
      logger.system.info("criando mensagem de resposta");
      try {
        await interaction.deferReply({ ephemeral: true });
      } catch (error) {
        logger.system.warn("falha na tentativa de deferir a resposta");
      }

      const embed = await createEmbed({
        guild: interaction.guild!,
        title: "🛑 Parado Ai! 🛑",
        description: `Você não possui permissão \`${permission}\` para executar esse comando.`,
        timestamp: true,
        footer: true,
        thumbnail:
          "https://media.discordapp.net/attachments/1264017504079188058/1264019577587634267/VID_20240719_214039.gif",
      });

      await interaction.editReply({
        content: "",
        embeds: [embed!],
      });
      logger.system.info("messagem de resposta enviada");
      return false;
    }

    logger.system.info(`acesso permitido!`);
    return true;
  } catch (error) {
    logger.system.error("erro ao executar verificação de permissão.", error);
  }
}
