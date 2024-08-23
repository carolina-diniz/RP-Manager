import { CommandInteraction, PermissionResolvable } from "discord.js";
import { logger } from "..";
import { createEmbed } from "./createEmbed";

export async function verifyPermission(
  interaction: CommandInteraction,
  permission: PermissionResolvable
) {
  const isDeferred = interaction.deferred;
  return new Promise(async (resolve, reject) => {
    const guild = await interaction.guild!;
    const user = await interaction.user;
    try {
      if (isDeferred) {
        await interaction.editReply({ content: "Verificando pemissões do usuário..." });
      }
      const member = await guild.members.resolve(interaction.member!.user.id);
      if (!member) throw new Error("Member not found");

      if (member.permissions.has(permission)) {
        logger.info("Permission Allowed", 5, guild);
        resolve(true);
      } else {
        if (isDeferred) {
          const title = "🛑 Parado Ai! 🛑";
          const description = `Você precisa ter permissão de \`${permission}\` para utilizar este comando.`;
          const thumbnail =
            "https://media.discordapp.net/attachments/1264017504079188058/1264019577587634267/VID_20240719_214039.gif";

          const embed = await createEmbed(
            guild,
            title,
            description,
            true,
            thumbnail,
            true
          );

          await interaction.editReply({ content: "", embeds: [embed!] });
        }

        logger.warn("User has no permissions", 5, __filename, guild, user);
        reject("User has no permissions");
      }
    } catch (error) {
      const msg = "Failed to verify access";
      logger.error(msg, error, 5, __filename, guild, user);

      if (isDeferred) await interaction.editReply({ content: msg });
      
      reject(error);
    }
  });
}
