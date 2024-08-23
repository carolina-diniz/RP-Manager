import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { client, logger } from "../..";
import { ModelMember } from "../../models/modelMember";
import { verifyPermission } from "../../utils/verifyPermission";

export const data = new SlashCommandBuilder().setName("getall").setDescription("O comando atualiza a lista de membros no banco de dados.");

export async function execute(interaction: CommandInteraction) {
  try {
    await interaction.deferReply({ ephemeral: true });
    if (!await verifyPermission(interaction, "Administrator")) return;

    const timeStart = Date.now();
    let count = 0;
    let savedCount = 0;

    (await interaction.guild!.members.fetch()).each(async (member) => {
      count++;

      const memberDb = await ModelMember.findOne({
        guildId: interaction.guildId,
        memberId: member.id,
      });

      if (!memberDb && member.nickname && member.nickname.includes('|')) {
        const nickname = member.nickname.split('|')
        let nameIG = 'error'
        let idIG = 'error'

        if (nickname.length == 2) {
          nameIG = nickname[0].trim();
          idIG = nickname[1].trim();
        }
        if (nickname.length == 3) {
          nameIG = nickname[1].trim();
          idIG = nickname[2].trim();
        }

        const newMember = new ModelMember({
          guildId: interaction.guildId,
          memberId: member.id,
          nickname: member.nickname,
          nameIG,
          idIG,
          isOnDiscord: true,
          alreadyBanned: false,
          allowedBy: client.user!.id,
          recruiterId: client.user!.id,
          createdAt: Date.now()
        })

        await newMember.save()
        .then(() => { savedCount++ })
        logger.info(`Member saved to database: ${member.user.globalName}`, 2);
      }


      await interaction.editReply({
        content: `Name: ${member.user.globalName}, Id: ${member.id}, Nickname: ${member.nickname}\n\nNew: ${savedCount} \nTotal: ${count}/${interaction.guild!.memberCount}`,
      });
    });
  } catch (error) {
    const msg = `Error executing ${interaction.commandName} command`;
    const user = interaction.user
    logger.error(msg, error, 3, __filename, interaction.guild!, user);

    await interaction.editReply({
      content: `Error executing ${interaction.commandName} command`,
    });
  }
}
