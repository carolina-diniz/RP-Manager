import { CommandInteraction } from "discord.js";
import { logger } from "../../../../events/on-InteractionCreate/onInteractionCreate";
import { createEmbed } from "../../../../util/createEmbed";
import { getDbGuild } from "../../../../util/getDbGuild";

export async function porcentagemVenda(interaction: CommandInteraction) {
  logger.setPath(__filename);
  try {
    const role = await interaction.options.get("cargo")?.role;
    const percent = await interaction.options.get("porcentagem")?.value;

    if (!role || !percent || typeof percent !== "number") return;

    const dbGuild = await getDbGuild(interaction);
    if (!dbGuild) throw new Error("Guild não encontrada no banco de dados");

    if (!dbGuild.salesRoles) {
      dbGuild.salesRoles = [{ id: role.id, percent }];
      logger.database.info("salesRoles created", "guild");
    } else {
      if (dbGuild.salesRoles.filter((roleParam) => roleParam.id === role.id).length > 0) {
        dbGuild.salesRoles = dbGuild.salesRoles.map((roleParam) => {
          if (roleParam.id === role.id) {
            roleParam.percent = percent;
            logger.database.info("salesRoles updated", "guild");
          }
          return roleParam;
        });
      } else {
        dbGuild.salesRoles.push({ id: role.id, percent });
        logger.database.info("salesRoles add", "guild");
      }
    }

    dbGuild.save();

    const embed = await createEmbed({
      guild: interaction.guild!,
      title: "Porcentagem de Venda Atualizada!",
      description: `Porcentagem de venda do cargo **<@&${role.id}>** foi atualizada para **${percent}%**`,
    });

    await Promise.all(
      dbGuild.salesRoles.map(async (roleParam) => {
        const role = await interaction.guild!.roles.resolve(roleParam.id);
        if (role) {
          console.log(role.name);
          embed!.addFields({
            name: role.name,
            value: `${roleParam.percent}%`,
            inline: true,
          });
        }
      })
    );

    await interaction.editReply({
      content: "",
      embeds: [embed!],
    });
  } catch (error) {
    logger.command.error("Error ao executar porcentagemVenda.ts", error);
  }
}
