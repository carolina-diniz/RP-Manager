import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { logger } from "../..";
import { createEmbed } from "../../utils/createEmbed";
import { getGuild } from "../../utils/getGuild";

export async function execute(interaction: ButtonInteraction) {
  logger.init(__filename);
  try {
    await verifyEntryRole(interaction);

    const modal = new ModalBuilder()
      .setCustomId("pedirset")
      .setTitle(`PEDIR SET - ${interaction.guild?.name.toUpperCase()}`);

    const name = new TextInputBuilder()
      .setCustomId("pedirset-name-input")
      .setLabel("Nome Completo")
      .setPlaceholder("Digite seu nome do jogo")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMinLength(2)
      .setMaxLength(20);

    const id = new TextInputBuilder()
      .setCustomId("pedirset-id-input")
      .setLabel("ID do Jogo")
      .setRequired(true)
      .setPlaceholder("Digite seu ID do jogo (F11)")
      .setMinLength(1)
      .setMaxLength(7)
      .setStyle(TextInputStyle.Short);

    const phone = new TextInputBuilder()
      .setCustomId("pedirset-phone-input")
      .setLabel("Celular do Jogo")
      .setRequired(true)
      .setPlaceholder("Digite seu número de celular do jogo")
      .setMinLength(6)
      .setMaxLength(7)
      .setStyle(TextInputStyle.Short);

    const recruiter = new TextInputBuilder()
      .setCustomId("pedirset-recruiter-input")
      .setLabel("ID do Recrutador")
      .setRequired(true)
      .setPlaceholder("Digite o ID de quem está te recrutando")
      .setMinLength(1)
      .setMaxLength(7)
      .setStyle(TextInputStyle.Short);

    const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(name);
    const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(id);
    const row3 = new ActionRowBuilder<TextInputBuilder>().addComponents(phone);
    const row4 = new ActionRowBuilder<TextInputBuilder>().addComponents(recruiter);

    modal.addComponents(row1, row2, row3, row4);
    await interaction.showModal(modal);
  } catch (error) {
    logger.error("Error executing button interaction pedirset", error, 5, __filename);
  }
}

export function verifyEntryRole(interaction: ButtonInteraction) {
  return new Promise(async (resolve, reject) => {
    try {
      const guildDb = await getGuild(interaction.guildId!);
      let validRoles = null 

      if (guildDb?.entryRoleId) {
        validRoles = await Promise.all(
          guildDb.entryRoleId.filter(async (roleDb) => {
            if (await interaction.guild?.roles.resolve(roleDb.id)) return true;
          })
        );
      } 
      
      if (!guildDb?.entryRoleId || !validRoles || validRoles.length == 0) {
        const title = "🚫 Cargo de entrada não configurado!";
        const description =
          "O cargo de entrada não foi configurado corretamente no sistema, contate um administrador do servidor para configurá-lo.";

        const embed = await createEmbed(
          interaction.guild!,
          title,
          description,
          true,
          false,
          true
        );

        await interaction.reply({ content: "", embeds: [embed!], ephemeral: true });
        throw new Error("Entry role isnt valid");
      }

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}
