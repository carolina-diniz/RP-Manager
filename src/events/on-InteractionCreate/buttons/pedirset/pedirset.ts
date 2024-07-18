import {
  ActionRowBuilder,
  ButtonInteraction,
  Client,
  Guild,
  ModalBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { ModelGuild } from "../../../../models/modelGuild";
import { createEmbed } from "../../../../util/createEmbed";
import { logger } from "../../../../util/logger";
import { verifyPermissions } from "../../../../util/verifyPermissions";

export async function execute(interaction: ButtonInteraction, client: Client) {
  try {
    if (!(await isEntryRoleExist(interaction))) return;

    const guild: Guild | null = interaction.guild;

    const modal = new ModalBuilder()
      .setCustomId("pedirset")
      .setTitle(`PEDIR SET - ${guild?.name.toUpperCase()}`);

    const name = new TextInputBuilder()
      .setCustomId("entrada_name_input")
      .setLabel("Nome Completo")
      .setPlaceholder("Digite seu nome do jogo")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMinLength(2)
      .setMaxLength(20);

    const id = new TextInputBuilder()
      .setCustomId("entrada_id_input")
      .setLabel("ID")
      .setRequired(true)
      .setPlaceholder("Digite seu ID do jogo")
      .setMinLength(1)
      .setMaxLength(7)
      .setStyle(TextInputStyle.Short);

    const telefone = new TextInputBuilder()
      .setCustomId("entrada_telefone_input")
      .setLabel("Telefone")
      .setRequired(true)
      .setPlaceholder("Digite seu número de telefone do jogo")
      .setMinLength(6)
      .setMaxLength(7)
      .setStyle(TextInputStyle.Short);

    const recrutador = new TextInputBuilder()
      .setCustomId("entrada_recrutador_input")
      .setLabel("ID Recrutador")
      .setRequired(true)
      .setPlaceholder("Digite o ID de quem está te recrutando")
      .setMinLength(2)
      .setMaxLength(20)
      .setStyle(TextInputStyle.Short);

    const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(name);
    const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(id);
    const row3 = new ActionRowBuilder<TextInputBuilder>().addComponents(telefone);
    const row4 = new ActionRowBuilder<TextInputBuilder>().addComponents(recrutador);

    modal.addComponents(row1, row2, row3, row4);
    await interaction.showModal(modal).catch((err) => console.error(err));
    logger.normal(`Modal pedir set criado para <@${interaction.user.id}>`);
  } catch (error) {
    logger.error(__filename, error);
  }
}

async function isEntryRoleExist(interaction: ButtonInteraction) {
  try {
    const dbGuild = await ModelGuild.findOne({ guildId: interaction.guildId });
    if (!dbGuild) throw new Error("Guild not found in database");

    let isValid = true;

    if (dbGuild.entryRoleId) {
      const listEntryRole = dbGuild.entryRoleId?.split('+')
      listEntryRole.forEach(async (roleId) => {
        const entryRole = await interaction.guild!.roles.fetch(roleId);
        if(!entryRole) isValid = false;
      })
    }


    if (!dbGuild.entryRoleId || !isValid) {
      await interaction.deferReply({ ephemeral: true });
      if (await verifyPermissions(interaction, "Administrator")) {
        await createEntryRoleModal(interaction);
      } else {
        const embed = await createEmbed({
          guild: interaction.guild!,
          title: "🚫 Cargo de entrada não configurado!",
          description:
            "O cargo de entrada não foi configurado corretamente no sistema, contate um administrador para configurá-lo.",
        });

        await interaction.editReply({
          content: "",
          embeds: [embed!],
        });
      }
      return false;
    }


    return true;
  } catch (error) {
    logger.error(__filename, error);
  }
}

async function createEntryRoleModal(interaction: ButtonInteraction) {
  try {
    const roles = await interaction.guild!.roles.fetch();
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("entryRoleMenu")
      .setPlaceholder("Selecione um cargo")
      .addOptions(
        roles.map((role) => ({
          label: role.name,
          value: role.id,
        }))
      );
    const row: any = new ActionRowBuilder().addComponents(selectMenu);

    const embed = await createEmbed({
      guild: interaction.guild!,
      title: "Configuração: Cargo de entrada",
      description:
        "**Selecionar cargo de entrada**\nEscolha o cargo que será atribuído ao usuário ter o set aprovado.",
    });

    await interaction.editReply({
      embeds: [embed!],
      components: [row],
    });

    setTimeout(async () => {
      await interaction.deleteReply();
    }, 30 * 1000);
  } catch (error) {
    logger.error(__filename, error);
  }
}
