import { CommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import { logger } from "../../events/on-InteractionCreate/onInteractionCreate";
import { verifyPermissions } from "../../util/verifyPermissions";
import { verifyPremiumAccess } from "../../util/verifyPremiumAccess";
import { venda } from "./venda/venda";

export const data = new SlashCommandBuilder()
.setName('relatorio') 
.setDescription('relatório')
.addSubcommandGroup(
  new SlashCommandSubcommandGroupBuilder()
  .setName('venda')
  .setDescription('Relatório de vendas')
  .addSubcommand(
    new SlashCommandSubcommandBuilder()
    .setName('criar')
    .setDescription('cria canal')
  )
)

export async function execute(interaction: CommandInteraction) {
  logger.setPath(__filename)
  try {
    const isAdmin = await verifyPermissions(interaction, 'Administrator')
    if (!isAdmin) throw new Error('Usuário não possui permissão para usar este comando!')

    const isPremium = await verifyPremiumAccess(interaction)
    if (!isPremium) throw new Error('Este servidor não possui premium!')

    const group = await interaction.options.data[0].name

    if (group === 'venda') {
      await venda(interaction)
    }

    if (group === 'porcentagem') {
      // Porcentagem
    }
  } catch (error) {
    logger.command.error('', error)
  }
  console.log()
}