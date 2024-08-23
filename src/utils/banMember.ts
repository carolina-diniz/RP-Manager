import { GuildMember } from "discord.js";
import { logger } from "..";

export async function banMember(
  member: GuildMember,
  staff: GuildMember,
  reason: string | number | boolean
) {
  return new Promise(async (resolve, reject) => {
    try {
      await member.ban({
        reason: `COMMAND: PD | BANNED BY: ${
          staff.nickname ?? staff.user.globalName
        } | REASON: ${reason} `,
      });
      logger.info(`User <@${member.id}> successfully banned`, 5)
      resolve(member);
    } catch (error) {
      logger.error("Error trying to ban member", error, 5, __filename);
      reject(error);
    }
  });
}
