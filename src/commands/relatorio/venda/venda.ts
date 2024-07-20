import { CommandInteraction } from "discord.js";
import { logger } from "../../../events/on-InteractionCreate/onInteractionCreate";
import { criarVenda } from "./criar/criarVenda";

export async function venda(interaction: CommandInteraction) {
  logger.setPath(__filename)
  try {
    if(interaction.options.data[0].options![0].name === 'criar') {
      await criarVenda(interaction)
    }
  } catch (error) {
    logger.command.error('', error)
  }
}