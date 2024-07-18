import { Client, Interaction } from "discord.js";
import { commands } from "../../commands/commands";
import { getNickname } from "../../util/getNickname";
import { logger } from "../../util/logger";
import { buttons } from "./buttons/buttons";
import { modalSubmit } from "./modals/modalSubmit";
import { stringSelectMenu } from "./string-select-menu/stringSelectMenu";

export async function onInteractionCreate(interaction: Interaction, client: Client) {

  // Commands
  if (interaction.isCommand()) {
    const { commandName } = interaction;
    
    if( commandName in commands) {
      logger.info(`[${interaction.guild!.name}][command] <${await getNickname({interaction})}> command: ${commandName}: Started`)
      await commands[commandName as keyof typeof commands].execute(interaction, client);
      logger.info(`[${interaction.guild!.name}][command] <${await getNickname({interaction})}> command: ${commandName}: Finished`)
    }
  }

  // Buttons
  if (interaction.isButton()) {
    const { customId } = interaction;

    if (customId in buttons) {
      logger.info(`[${interaction.guild!.name}][button] <${await getNickname({interaction})}> button: ${customId}: Started`)
      await buttons[customId as keyof typeof buttons].execute(interaction, client);
      logger.info(`[${interaction.guild!.name}][button] <${await getNickname({interaction})}> button: ${customId}: Finished`)
    }
  }

  // Buttons
  if (interaction.isStringSelectMenu()) {
    const { customId } = interaction;

    if (customId in stringSelectMenu) {
      logger.info(`[${interaction.guild!.name}][select-menu] <${await getNickname({interaction})}> select-menu : ${customId}: Started`)
      await stringSelectMenu[customId as keyof typeof stringSelectMenu].execute(interaction);
      logger.info(`[${interaction.guild!.name}][select-menu] <${await getNickname({interaction})}> select-menu : ${customId}: Finished`)
    }
  }

  // Modals
  if (interaction.isModalSubmit()) {
    const { customId } = interaction;

    if (customId in modalSubmit) {
      logger.info(`[${interaction.guild!.name}][modal-submit] <${await getNickname({interaction})}> modal-submit : ${customId}: Started`)
      await modalSubmit[customId as keyof typeof modalSubmit].execute(interaction);
      logger.info(`[${interaction.guild!.name}][modal-submit] <${await getNickname({interaction})}> modal-submit : ${customId}: Finished`)
    }
  }
}
