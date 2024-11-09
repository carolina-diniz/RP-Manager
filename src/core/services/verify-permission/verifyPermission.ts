import { CommandInteraction, Guild, PermissionResolvable } from "discord.js";
import { logger } from "../../..";
import { editInteractionReply } from "../../../utils/editInteractionReply";
import { createEmbed } from "../../../utils/createEmbed";

export async function verifyPermission(
  interaction: CommandInteraction,
  permission: PermissionResolvable
) {
  return new Promise(async (resolve, reject) => {
    logger.init({ filePath: __filename });
    const { guild, deferred, user } = interaction;

    try {
      if (deferred) {
        await interaction.editReply({ content: "Verificando pemissões do usuário..." });
      }

      const hasPermission = await checkUserPermission(guild!, user.id, permission);

      if (hasPermission) {
        if (deferred) {
          await interaction.editReply({ content: "Permissão concedida!" });
        }
        logger.info("Permission Allowed", 5, guild!);
        resolve(true);
      } else {
        await replyMessage(interaction, deferred, permission);
        logger.warn("User has no permissions", 5, __filename, guild!, user);
        reject("User has no permissions");
      }
    } catch (error) {
      logger.error("Failed to verify access", error, 5, __filename, guild!, user);
      await editInteractionReply(interaction, deferred, "Failed to verify access");
      reject(error);
    }
  });
}

// Verifica se usuário possui permissão expecífica
async function checkUserPermission(
  guild: Guild,
  userId: string,
  permission: PermissionResolvable
): Promise<boolean> {
  const member = guild.members.resolve(userId);
  if (!member) throw new Error("Member not found");

  return member.permissions.has(permission);
}

// Reply message
async function replyMessage(
  interaction: CommandInteraction,
  deferred: boolean,
  permission: PermissionResolvable
): Promise<void> {
  if (deferred) {
    try {
      const embed = await createPermissionEmbed(interaction.guild!, permission);
      await interaction.editReply({ content: "", embeds: [embed] });
    } catch (error) {
      console.error("Error ao criar ou editar o embed:", error);
      await interaction.editReply({
        content: "Ocorreu um erro ao processar sua solicitação.",
      });
    }
  }
}

async function createPermissionEmbed(guild: Guild, permission: PermissionResolvable) {
  const PERMISSION_EMBED_TITLE = "🛑 Parado Ai! 🛑";
  const PERMISSION_EMBED_DESCRIPTION = `Você precisa ter permissão de \`${permission}\` para utilizar este comando.`;
  const PERMISSION_EMBED_THUMBNAIL =
    "https://media.discordapp.net/attachments/1264017504079188058/1264019577587634267/VID_20240719_214039.gif";

  return await createEmbed(
    guild,
    PERMISSION_EMBED_TITLE,
    PERMISSION_EMBED_DESCRIPTION,
    true,
    PERMISSION_EMBED_THUMBNAIL,
    true
  );
}
