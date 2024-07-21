import { CommandInteraction } from "discord.js";
import { logger } from "../../../events/on-InteractionCreate/onInteractionCreate";
import { verifyPermissions } from "../../../util/verifyPermissions";
import { verifyPremiumAccess } from "../../../util/verifyPremiumAccess";
import { criarVenda } from "./criar/criarVenda";
import { porcentagemVenda } from "./porcentagem/porcentagemVenda";

export async function venda(interaction: CommandInteraction) {
  logger.setPath(__filename);
  try {
    await interaction.deferReply({ ephemeral: true });

    // Verifica se o usuário possui permissão para usar este comando
    const isAdmin = await verifyPermissions(interaction, "Administrator");
    if (!isAdmin) throw new Error("Usuário não possui permissão para usar este comando!");

    // Verifica se o servidor possui premium
    const isPremium = await verifyPremiumAccess(interaction);
    if (!isPremium) throw new Error("Este servidor não possui premium!");

    if (interaction.options.data[0].options![0].name === "criar") {
      await criarVenda(interaction);
    }
    if (interaction.options.data[0].options![0].name === "config") {
      await porcentagemVenda(interaction);
    }
  } catch (error) {
    logger.command.error("Erro ao executar venda.ts", error);
  }
}
