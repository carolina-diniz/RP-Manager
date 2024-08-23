import { ActionRowBuilder, ButtonInteraction, StringSelectMenuBuilder } from "discord.js";
import { logger } from "../..";
import { cache } from "../../cache/interaction";
import { createEmbed } from "../../utils/createEmbed";

export async function execute(interaction: ButtonInteraction) {
  logger.init(__filename);
  try {
    await interaction.deferReply({ ephemeral: true });

    const title = "Relatório Munição";
    const description =
      "Selecione abaixo o nome da munição que deseja fazer o relatório. Após selecionar, aparecerá uma janela para definir a quantidade e quem recebeu a munição.";

    const embed = await createEmbed(interaction.guild!, title, description);

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("municoes")
      .setPlaceholder("Selecione a Munição")
      .setOptions(
        { label: "[PISTOL] Fajuta", value: "fajuta" },
        { label: "[PISTOL] Five Seven", value: "fiveseven" },
        { label: "[PISTOL] Tec 9", value: "tec9" },
        { label: "[RIFLE] AK-47", value: "ak47" },
        { label: "[RIFLE] AK-MK2", value: "akmk2" },
        { label: "[RIFLE] G3", value: "g3" },
        { label: "[RIFLE] M4", value: "m4" },
        { label: "[MG PISTOL] SMG MP5", value: "smg" },
        { label: "[SPECIAL] AP Pistol", value: "appistol" },
        { label: "[SPECIAL] SMG MK2", value: "smgmk2" }
      );

    const row: any = new ActionRowBuilder().addComponents(selectMenu);

    cache[interaction.user.id] = {
      relatorio_bau: {
        interaction: interaction,
        selectedWeapon: '',
      },
    };
    
    await interaction.editReply({ embeds: [embed], components: [row] });
  } catch (error) {
    logger.error("Error executing button", error, 5, __filename);
  }
}
