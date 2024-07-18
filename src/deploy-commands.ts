import { REST, Routes, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import dotenv from "dotenv";
import { commands } from "./commands/commands";
import { IDeployConfig } from "./interfaces/deployConfig";
import { logger } from "./util/logger";

dotenv.config();

const TOKEN: string | undefined = process.env.TOKEN;
if (!TOKEN) logger.error(__dirname, 'TOKEN Not Found')
const rest: REST = new REST({ version: "10" }).setToken(TOKEN!);
const commandsData: (SlashCommandBuilder | SlashCommandOptionsOnlyBuilder)[] =
  Object.values(commands).map((command) => command.data);

export async function deployCommands(deployConfig: IDeployConfig) {
  try {
    logger.updated('<deploy-commands>: Started')

    let data: any = await rest.put(
      Routes.applicationGuildCommands(deployConfig.clientId, deployConfig.guildId),
      { body: commandsData}
    )

    logger.updated(`[deploy-commands] finished: ${data.length}`)
  } catch (error) {
    logger.error(__filename, error)
  }
}