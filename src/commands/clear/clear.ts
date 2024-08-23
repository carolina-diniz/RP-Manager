import {
  Collection,
  CommandInteraction,
  Message,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
} from "discord.js";
import { logger } from "../..";
import { verifyPermission } from "../../utils/verifyPermission";
import { verifyPremiumAccess } from "../../utils/verifyPremiumAccess";

export const data = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("O comando apaga mensagens do servidor.")
  .addIntegerOption(
    new SlashCommandIntegerOption()
      .setName("limite")
      .setDescription("Você pode definir o número de mensagens que deseja limpar.")
      .setRequired(true)
      .setMaxValue(1000)
      .setMinValue(1)
  );

export async function execute(interaction: CommandInteraction) {
  try {
    await interaction.deferReply({ ephemeral: true });
    if (
      !(await verifyPremiumAccess(interaction)) ||
      !(await verifyPermission(interaction, "Administrator"))
    )
      return null;

    const messageCount = await interaction.options.get("limite")?.value;
    if (typeof messageCount !== "number") return;

    let before = undefined;
    let messages: any[] = [];
    let timeStart = Date.now();

    let fetchedCount = 0;

    await interaction.editReply({
      content: `Obtendo mensanges...`,
    });

    while (fetchedCount < messageCount) {
      const fetchedMessages: Collection<
        string,
        Message<boolean>
      > = await interaction.channel!.messages.fetch({
        limit: messageCount > 100 ? 100 : messageCount,
        before,
      });
      messages = [...messages, ...fetchedMessages.values()!];

      fetchedCount += fetchedMessages.size;

      if (fetchedMessages.size < 100) break;

      before = fetchedMessages.lastKey();
    }

    await interaction.editReply({
      content: `${messages.length} mensagens obtidas`,
    });

    const [countSuccess, countFailed] = await deleteMessages(
      interaction,
      messages,
      timeStart
    );

    await interaction.editReply({
      content: `
## Limpeza Finalizada!
\`\`\`${countSuccess}/${messages.length} messages deleted
${countFailed} messages error\`\`\`
Tempo decorrido: ${Date.now() - timeStart}ms`,
    });

    setTimeout(async () => {
      await interaction.deleteReply().catch();
    }, 5000);
  } catch (error) {
    const msg = `Error executing ${interaction.commandName} command`;
    const user = interaction.user
    logger.error(msg, error, 3, __filename, interaction.guild!, user);

    await interaction.editReply({
      content: `Error executing ${interaction.commandName} command`,
    });
  }
}

async function deleteMessages(
  interaction: CommandInteraction,
  messages: Message[],
  timeStart: number
): Promise<number[]> {
  return new Promise((resolve, reject) => {
    let countSuccess = 0;
    let countFailed = 0;

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      setTimeout(async () => {
        await message
          .delete()
          .then(async () => {
            countSuccess++;
            await showCountDeffered(
              interaction,
              countSuccess,
              countFailed,
              messages.length,
              timeStart
            );
          })
          .catch(async () => {
            countFailed++;
            await showCountDeffered(
              interaction,
              countSuccess,
              countFailed,
              messages.length,
              timeStart
            );
          });

        if (i + 1 == messages.length) {
          resolve([countSuccess, countFailed]);
        }
      }, 1500);
    }
  });
}

async function showCountDeffered(
  interaction: CommandInteraction,
  countSuccess: number,
  countFailed: number,
  countMessages: number,
  timeStart: number
) {
  await interaction.editReply({
    content: `
## Limpeza Iniciada...
\`\`\`${countSuccess}/${countMessages} messages deleted
${countFailed} messages error\`\`\`
Tempo decorrido: <t:${Math.floor(timeStart / 1000)}:R>`,
  });
}
