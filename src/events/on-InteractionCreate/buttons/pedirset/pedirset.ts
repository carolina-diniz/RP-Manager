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
import { createEmbed } from "../../../../util/createEmbed";
import { getDbGuild } from "../../../../util/getDbGuild";
import { verifyPermissions } from "../../../../util/verifyPermissions";
import { logger } from "../../onInteractionCreate";

export async function execute(interaction: ButtonInteraction, client: Client) {
  await logger.setPath(__filename)

  try {
    const entryRole = await isEntryRoleExist(interaction);
    if (!entryRole) return;

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
    logger.button.info(`Modal pedir set criado`);
  } catch (error) {
    logger.button.error("error ao criar modal", error);
  }
}

async function isEntryRoleExist(interaction: ButtonInteraction) {
  try {
    let isValid = true;

    const dbGuild = await getDbGuild(interaction);
    if (!dbGuild) throw new Error("Guild not found in database");

    if (dbGuild.entryRoleId) {
      const listEntryRole = dbGuild.entryRoleId?.split("+");
      listEntryRole.forEach(async (roleId) => {
        if (!(await interaction.guild!.roles.fetch(roleId))) isValid = false;
      });
    }

    if (!dbGuild.entryRoleId || !isValid) {
      await interaction.deferReply({ ephemeral: true });
      if (await verifyPermissions(interaction, "Administrator")) {
        await createEntryRoleMenu(interaction);
      } else {
        const embed = await createEmbed({
          guild: interaction.guild!,
          title: "🚫 Cargo de entrada não configurado!",
          description:
            "O cargo de entrada não foi configurado corretamente no sistema, contate um administrador para configurá-lo.",
          timestamp: true,
          footer: true,
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
    logger.button.error("Error ao verificar se entryRoleId existe", error);
  }
}

async function createEntryRoleMenu(interaction: ButtonInteraction) {
  try {
    const roles = await interaction.guild!.roles.fetch();

    if (
      roles.map((role) => ({
        label: role.name,
        value: role.id,
      })).length > 25
    ) {
      const embed = await createEmbed({
        guild: interaction.guild!,
        title: "Configuração: Cargo de entrada",
        description:
          "Você possui mais de 25 cargos, por favor, configure os cargos de entrada no sistema usando o comando `cargo_entrada_add`.",
        timestamp: true,
        thumbnail: true,
        footer: true,
      });

      await interaction.editReply({
        embeds: [embed!],
      });

      return null;
    }

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
    logger.button.error("Erro ao criar menu de seleção", error);
  }
}
