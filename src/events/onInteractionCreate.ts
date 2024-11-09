import { Interaction } from "discord.js";
import { buttons } from "../buttons/buttons";
import { commands } from "../commands/commands";
import { modalSubmit } from "../modals/modalSubmit";

export async function onInteractionCreate(interaction: Interaction) {
  if (interaction.isCommand()) {
    const { commandName } = interaction;
    if (commandName in commands) {
      await commands[commandName as keyof typeof commands].execute(interaction);
    }
  }

  // Buttons
  if (interaction.isButton()) {
    const { customId } = interaction;

    if (customId in buttons) {
      await buttons[customId as keyof typeof buttons].execute(interaction);
    }
  }

  /*
  if (interaction.isStringSelectMenu()) {
    const { customId } = interaction;

    if (customId in stringSelectMenu) {
      await stringSelectMenu[customId as keyof typeof stringSelectMenu].execute(interaction
      );
    }
  }*/

  // Modals
  if (interaction.isModalSubmit()) {
    const { customId } = interaction;

    if (customId in modalSubmit) {
      await modalSubmit[customId as keyof typeof modalSubmit].execute(interaction);
    }
  }
}
