import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  CommandInteraction,
  GuildBasedChannel,
  TextChannel,
} from "discord.js";
import { logger } from "../../..";
import { createEmbed } from "../../../utils/createEmbed";
import { getGuild } from "../../../utils/getGuild";

export async function relatorioBauCommand(
  interaction: CommandInteraction
): Promise<void> {
  logger.init(__filename, 3, interaction.guild!);

  return new Promise(async (resolve, reject) => {
    try {
      if (interaction.options.data[0].options![0].name === "criar") {
        await relatorioBauCriar(interaction);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

async function relatorioBauCriar(interaction: CommandInteraction): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const buttonChannel = (await createButtonChestChannel(interaction)) as TextChannel;
      const reportChannel = await createReportChestChannel(interaction);

      const message = await createMessageChestChannel(buttonChannel);

      const title = "Relatório de Vendas";
      const description = `Canal de ${buttonChannel.name} criado com sucesso!\n<#${
        buttonChannel!.id
      }>\n<#${reportChannel!.id}>`;

      const embed = await createEmbed(
        interaction.guild!,
        title,
        description,
        true,
        true,
        true
      );

      await interaction.editReply({ content: "", embeds: [embed!] });
      logger.info(`command ${interaction.commandName} replyed successfully`, 3, interaction.guild!)
      resolve()
    } catch (error) {
      reject(error);
    }
  });
}

function createReportChestChannel(
  interaction: CommandInteraction
): Promise<TextChannel | GuildBasedChannel> {
  return new Promise(async (resolve, reject) => {
    try {
      await interaction.editReply({ content: "Verificando canal relatorio-bau..." });
      const guildDb = await getGuild(interaction.guildId!);
      if (!guildDb) throw new Error("Guild not found in database");

      if (guildDb.reportChestId) {
        const channel = await interaction.guild!.channels.resolve(guildDb.reportChestId);
        if (channel) resolve(channel);
        else throw new Error("Report chest channel not found in database");
      } else {
        const channel = await interaction.guild!.channels.create({
          name: "relatório-bau",
          permissionOverwrites: [
            {
              id: interaction.guild!.roles.everyone.id,
              allow: [],
              deny: ["SendMessages"],
            },
          ],
          type: ChannelType.GuildText,
          topic: "Canal para criar relatórios de items retiradas do bau",
        });

        if (!channel) throw new Error("Error creating channel");
        logger.info(`Channel ${channel.name} created successfully`, 5, interaction.guild!);
        guildDb.reportChestId = channel.id;
        await guildDb.save();
        resolve(channel);
      }
    } catch (error) {
      reject(error);
    }
  });
}

function createMessageChestChannel(channel: TextChannel) {
  return new Promise(async (resolve, reject) => {
    try {
      const title = "Relatório Baú";
      const description = `Sistema para relatório de retirada de itens do baú.\n\nClique no botão para iniciar`;
      const embed = await createEmbed(channel.guild!, title, description, false, true);
      const row = await createButtons();
      const message = await channel.send({
        content: "",
        embeds: [embed!],
        components: [row!],
      });
      resolve(message);
    } catch (error) {
      reject(error);
    }
  });
}

function createButtons(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const button1 = new ButtonBuilder()
        .setCustomId("relatorio_armas")
        .setLabel("Armas")
        .setStyle(ButtonStyle.Primary);

      const button2 = new ButtonBuilder()
        .setCustomId("relatorio_municoes")
        .setLabel("Munições")
        .setStyle(ButtonStyle.Primary);

      const button3 = new ButtonBuilder()
        .setCustomId("relatorio_coletes")
        .setLabel("Coletes")
        .setStyle(ButtonStyle.Primary);

      const button4 = new ButtonBuilder()
        .setCustomId("relatorio_outros")
        .setLabel("Outros")
        .setStyle(ButtonStyle.Primary);

      const row: any = new ActionRowBuilder().addComponents(
        button1,
        button2,
        button3,
        button4
      );
      resolve(row);
    } catch (error) {
      reject(error);
    }
  });
}

function createButtonChestChannel(
  interaction: CommandInteraction
): Promise<TextChannel | GuildBasedChannel> {
  return new Promise(async (resolve, reject) => {
    try {
      await interaction.editReply({ content: "Verificando canal botão-bau..." });
      const guildDb = await getGuild(interaction.guildId!);
      if (!guildDb) throw new Error("Guild not found in database");

      if (guildDb.reportButtonChestId) {
        const channel = await interaction.guild!.channels.resolve(
          guildDb.reportButtonChestId
        );
        if (channel) resolve(channel);
        else throw new Error("Report chest channel not found in database");
      } else {
        const channel = await interaction.guild!.channels.create({
          name: "botão-bau",
          permissionOverwrites: [
            {
              id: interaction.guild!.roles.everyone.id,
              allow: [],
              deny: ["SendMessages"],
            },
          ],
          type: ChannelType.GuildText,
          topic: "Canal para criar relatórios de items retiradas do bau",
        });

        if (!channel) throw new Error("Error creating channel");
        logger.info(`Channel ${channel.name} created successfully`, 5, interaction.guild!);
        guildDb.reportButtonChestId = channel.id;
        await guildDb.save();
        resolve(channel);
      }
    } catch (error) {
      reject(error);
    }
  });
}
