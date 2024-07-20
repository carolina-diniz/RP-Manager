import { Client, Interaction } from "discord.js";
import { Logger } from "../../classes/logger";
import { commands } from "../../commands/commands";
import { buttons } from "./buttons/buttons";
import { modalSubmit } from "./modals/modalSubmit";
import { stringSelectMenu } from "./string-select-menu/stringSelectMenu";
export const logger = new Logger(__filename);

export async function onInteractionCreate(interaction: Interaction, client: Client) {
  await logger.config(interaction)

  // Commands
  if (interaction.isCommand()) {
    const { commandName } = interaction;
    
    if( commandName in commands) {
      logger.command.info(`comando ${commandName} iniciado...`)
      await commands[commandName as keyof typeof commands].execute(interaction, client);
      logger.command.info(`comando ${commandName} finalizado`)
    }
  }

  // Buttons
  if (interaction.isButton()) {
    const { customId } = interaction;

    if (customId in buttons) {
      //logger.info(`[${interaction.guild!.name}][button] <${await getNickname({interaction})}> button: ${customId}: Started`)
      await buttons[customId as keyof typeof buttons].execute(interaction, client);
      //logger.info(`[${interaction.guild!.name}][button] <${await getNickname({interaction})}> button: ${customId}: Finished`)
    }
  }

  // Buttons
  if (interaction.isStringSelectMenu()) {
    const { customId } = interaction;

    if (customId in stringSelectMenu) {
      //logger.info(`[${interaction.guild!.name}][select-menu] <${await getNickname({interaction})}> select-menu : ${customId}: Started`)
      await stringSelectMenu[customId as keyof typeof stringSelectMenu].execute(interaction);
      //logger.info(`[${interaction.guild!.name}][select-menu] <${await getNickname({interaction})}> select-menu : ${customId}: Finished`)
    }
  }

  // Modals
  if (interaction.isModalSubmit()) {
    const { customId } = interaction;

    if (customId in modalSubmit) {
      //logger.info(`[${interaction.guild!.name}][modal-submit] <${await getNickname({interaction})}> modal-submit : ${customId}: Started`)
      await modalSubmit[customId as keyof typeof modalSubmit].execute(interaction);
      //logger.info(`[${interaction.guild!.name}][modal-submit] <${await getNickname({interaction})}> modal-submit : ${customId}: Finished`)
    }
  }
}
