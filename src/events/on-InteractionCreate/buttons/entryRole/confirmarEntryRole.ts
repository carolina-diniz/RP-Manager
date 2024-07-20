import { ButtonInteraction } from "discord.js";
import { ModelGuild } from "../../../../models/modelGuild";
import { createEmbed } from "../../../../util/createEmbed";
import { logger } from "../../../../util/logger";

export async function execute(interaction: ButtonInteraction) {
  try {
    const dbGuild = await ModelGuild.findOne({ guildId: interaction.guildId });
    if (!dbGuild) throw new Error("Guild not found in database");

    const roleId = interaction.message.embeds[0].data.footer!.text.split(": ")[1];

    dbGuild.entryRoleId = roleId;

    await dbGuild
      .save()
      .then(() => logger.database.update(`[${dbGuild.guildId}] entry role id`))
      .catch((err) => logger.database.error(__dirname, err));

    const embed = await createEmbed({
      guild: interaction.guild!,
      title: "Cargo de Entrada Definido!",
      description: `O cargo de entrada para este servidor foi definido com sucesso!\nPara adicionar mais, use o comando \`cargo_entrada_add\`.`,
    });

    await interaction.update({
      embeds: [embed!],
      components: [],
    });

  } catch (error) {
    logger.error(__filename, error);
  }
}
