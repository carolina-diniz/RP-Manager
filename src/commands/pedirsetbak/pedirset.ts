import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandRoleOption,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";
import { logger } from "../..";
import { verifyPermission } from "../../utils/verifyPermission";
import { pedirsetCriar } from "./criar/pedirset-criar";
import { pedirsetEntradaAdd } from "./entrada/pedirset-entrada-add";
import { pedirsetEntradaDel } from "./entrada/pedirset-entrada-del";
import { pedirsetRemoveAdd } from "./remover/pedirset-remover-add";
import { pedirsetRemoveDel } from "./remover/pedirset-remover-del";

export const data = new SlashCommandBuilder()
  .setName("pedirset")
  .setDescription("Cria a estrutura básica do sistema de pedidos")
  .addSubcommand(
    new SlashCommandSubcommandBuilder().setName("criar").setDescription("criar")
  )
  .addSubcommandGroup(
    new SlashCommandSubcommandGroupBuilder()
      .setName("entrada")
      .setDescription("entrada")
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("add")
          .setDescription(
            "Define um cargo a ser adicionado a um membro quando seu pedido de entrada for aprovado."
          )
          .addRoleOption(
            new SlashCommandRoleOption()
              .setName("cargo")
              .setDescription("cargo")
              .setRequired(true)
          )
      )
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("del")
          .setDescription(
            "Remove um cargo da lista de cargos a serem adicionados em pedidos de entrada aprovados."
          )
          .addRoleOption(
            new SlashCommandRoleOption()
              .setName("cargo")
              .setDescription("cargo")
              .setRequired(true)
          )
      )
  )
  .addSubcommandGroup(
    new SlashCommandSubcommandGroupBuilder()
      .setName("remover")
      .setDescription("remover")
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("add")
          .setDescription(
            "Define um cargo a ser removido de um membro quando seu pedido de entrada for aprovado."
          )
          .addRoleOption(
            new SlashCommandRoleOption()
              .setName("cargo")
              .setDescription("cargo")
              .setRequired(true)
          )
      )
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("del")
          .setDescription(
            "Remove um cargo da lista de cargos a serem removidos em pedidos de entrada aprovados."
          )
          .addRoleOption(
            new SlashCommandRoleOption()
              .setName("cargo")
              .setDescription("cargo")
              .setRequired(true)
          )
      )
  );

export async function execute(interaction: CommandInteraction) {
  try {
    await interaction.deferReply({ ephemeral: true });

    if (!(await verifyPermission(interaction, "Administrator"))) return null;

    const interactionData = interaction.options.data[0];

    if (interactionData.name === "criar") await pedirsetCriar(interaction);

    if (interactionData.name === "entrada") {
      if (interactionData.options![0].name === "add") {
        await pedirsetEntradaAdd(interaction);
      }
      if (interactionData.options![0].name === "del") {
        await pedirsetEntradaDel(interaction);
      }
    }

    if (interactionData.name === "remover") {
      if (interactionData.options![0].name === "add") {
        await pedirsetRemoveAdd(interaction);
      }
      if (interactionData.options![0].name === "del") {
        await pedirsetRemoveDel(interaction);
      }
    }
  } catch (error) {
    const msg = `Error executing ${interaction.commandName} command`;
    const user = interaction.user;
    logger.error(msg, error, 3, __filename, interaction.guild!, user);

    await interaction.editReply({
      content: `Error executing ${interaction.commandName} command`,
    });
  }
}
