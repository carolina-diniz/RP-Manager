import { TextInputBuilder, TextInputStyle } from "discord.js";

export const textInputBuilderItem = new TextInputBuilder()
  .setCustomId("item_name")
  .setLabel("Nome do item:")
  .setStyle(TextInputStyle.Short)
  .setMinLength(1)
  .setMaxLength(20)
  .setRequired(true);

export const textInputBuilderQuantity = new TextInputBuilder()
  .setCustomId("quantity")
  .setLabel("Quantidade:")
  .setStyle(TextInputStyle.Short)
  .setMinLength(1)
  .setMaxLength(6)
  .setRequired(true);

export const textInputBuilderMember = new TextInputBuilder()
  .setCustomId("member")
  .setLabel("ID do Membro:")
  .setStyle(TextInputStyle.Short)
  .setMinLength(1)
  .setMaxLength(20)
  .setRequired(true);

export const textInputBuilderReason = new TextInputBuilder()
.setCustomId("reason")
.setLabel("Motivo (Não obrigatório):")
.setStyle(TextInputStyle.Paragraph)
.setRequired(false)