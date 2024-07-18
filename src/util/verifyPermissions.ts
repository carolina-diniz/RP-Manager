import { ButtonInteraction, CommandInteraction, PermissionResolvable } from "discord.js";
import { getNickname } from "./getNickname";
import { logger } from "./logger";

export async function verifyPermissions(
  interaction: CommandInteraction | ButtonInteraction,
  permission: PermissionResolvable
) {
  try {
    const staff = await interaction.guild?.members.resolve(interaction.user.id);
    if (!staff){
      throw new Error(`Usuário não é um membro do servidor ${interaction.guild!.name}`);
    }

    if (!staff.permissions.has(permission)) {
      await interaction.editReply("Você não possui permissão para usar este comando!");
      logger.warn(`Deny Access! <${await getNickname({interaction})}> dont have permission to use this command.`);
      return false;
    }

    logger.info(`Allow Access! <${await getNickname({interaction})}>.`);
    return true;
  } catch (error) {
    logger.error(__filename, error);
  }
}
