import {
  ButtonInteraction,
  ChannelType
} from "discord.js";
import { logger } from "../../..";
import { createButtonsHome, createEmbedHome } from "../../commands/pedirset/pedirset";
import { database } from "../../services/database/database.service";

export async function execute(interaction: ButtonInteraction) {
  try {
    logger.init({ filePath: __filename });
    await createAprovarsetChannel(interaction);
    
    const embed = await createEmbedHome(interaction);
    const buttons = await createButtonsHome();
    
    await interaction.update({ embeds: [embed], components: [buttons] });
  } catch (error) {
    logger.error("Error executing command", error, 5, __filename);
    await interaction.editReply({ content: "Ocorreu um erro ao executar o comando." });
  }
}

async function createAprovarsetChannel(interaction: ButtonInteraction) {
  try {
    const guildDb = await database.getGuild(interaction.guildId!);
    const channel = await interaction.guild!.channels.create({
      name: "aprovar-set",
      permissionOverwrites: [
        {
          id: interaction.guild!.roles.everyone.id,
          allow: ["ReadMessageHistory", "ManageMessages"],
          deny: [
            "ViewChannel",
            "SendMessages",
            "SendMessagesInThreads",
            "SendPolls",
            "SendTTSMessages",
            "SendVoiceMessages",
          ],
        },
      ],
      type: ChannelType.GuildText,
    });

    if (!channel) throw new Error("Error creating channel");
    logger.info(`Channel ${channel.name} created successfully`);

    if (guildDb) {
      guildDb.aprovarsetChannelId = channel.id;
      await guildDb.save();
    }

    return channel;
  } catch (error) {}
}
