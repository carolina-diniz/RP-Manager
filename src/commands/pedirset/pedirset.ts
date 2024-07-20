import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandRoleOption,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";
import { logger } from "../../events/on-InteractionCreate/onInteractionCreate";
import { criar } from "./criar/criarPedirset";
import { entradaAdd } from "./entrada/entrada.add";
import { entradaDel } from "./entrada/entrada.del";
import { removerAdd } from "./remover/remover.add";
import { removerDel } from "./remover/remover.del";

export const data = new SlashCommandBuilder()
  .setName("pedirset")
  .setDescription("Cria um canal para pedir sets de forma organizada.")
  .addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName("criar")
      .setDescription("Cria um novo canal para pedir sets.")
  )
  .addSubcommandGroup(
    new SlashCommandSubcommandGroupBuilder()
      .setName("entrada")
      .setDescription("Grupo com opções para cargo de entrada.")
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("add")
          .setDescription("Adiciona cargo a lista de cargos adicionados ao aprovar set.")
          .addRoleOption(
            new SlashCommandRoleOption()
              .setName("cargo")
              .setDescription(
                "Cargo para adicionar a lista de cargos ADICIONADOS ao aprovar set."
              )
              .setRequired(true)
          )
      )
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("del")
          .setDescription("Remove cargo a lista de cargos adicionados ao aprovar set.")
          .addRoleOption(
            new SlashCommandRoleOption()
              .setName("cargo")
              .setDescription(
                "Cargo para remover da lista de cargos ADICIONADOS ao aprovar set."
              )
              .setRequired(true)
          )
      )
  )
  .addSubcommandGroup(
    new SlashCommandSubcommandGroupBuilder()
      .setName("remover")
      .setDescription("Grupo com opções para cargo de entrada.")
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("add")
          .setDescription("Adicionar cargo para ser REMOVIDOS ao aprovar set")
          .addRoleOption(
            new SlashCommandRoleOption()
              .setName("cargo")
              .setDescription(
                "Cargo para adicionar a lista de cargos REMOVIDOS ao aprovar set."
              )
              .setRequired(true)
          )
      )
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("del")
          .setDescription("Remove cargo a lista de cargos REMOVIDOS ao aprovar set.")
          .addRoleOption(
            new SlashCommandRoleOption()
              .setName("cargo")
              .setDescription(
                "Cargo para remover da lista de cargos REMOVIDOS ao aprovar set."
              )
              .setRequired(true)
          )
      )
  );

export async function execute(interaction: CommandInteraction) {
  logger.setPath(__filename);
  try {
    const interactionData = interaction.options.data[0];
    console.log(interactionData);

    if (interactionData.name === "criar") await criar(interaction);

    if (interactionData.name === "entrada") {
      if (interactionData.options![0].name === "add") {
        await entradaAdd(interaction);
      }
      if (interactionData.options![0].name === "del") {
        await entradaDel(interaction);
      }
    }
    if (interactionData.name === "remover") {
      if (interactionData.options![0].name === "add") {
        await removerAdd(interaction);
      }
      if (interactionData.options![0].name === "del") {
        await removerDel(interaction);
      }
    }
  } catch (error) {
    logger.command.error("", error);
  }
}
