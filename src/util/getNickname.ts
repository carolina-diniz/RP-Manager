import { CommandInteraction, Interaction } from "discord.js";
import { logger } from "./logger";

interface IMember {
  interaction: Interaction| CommandInteraction;
  memberId?: string | null
}

export async function getNickname(data: IMember) {
  try {
    const member = await data.interaction.guild!.members.resolve(data.memberId ?? data.interaction.user.id);
    if (!member) throw new Error("Member not found");

    return member.nickname ?? member.user.username;
  } catch (error) {
    logger.error(__filename, error);
    return null;
  }
}
