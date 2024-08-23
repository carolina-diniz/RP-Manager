import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { logger } from ".";
import { commands } from "./commands/commands";
dotenv.config();

const TOKEN: string | undefined = process.env.TOKEN;
const rest: REST = new REST({ version: "10" }).setToken(TOKEN!);
const commandsData = Object.values(commands).map((command) => command.data);

export interface IDeployConfig {
  guildId: string;
  clientId: string;
}

export async function deployCommands(deployConfig: IDeployConfig) {
  try {
    let data: any = await rest.put(
      Routes.applicationGuildCommands(deployConfig.clientId, deployConfig.guildId),
      { body: commandsData }
    );
    logger.info(`${data.length} Successfully deployed commands to Discord`, 5);
  } catch (error) {
    logger.error("Failed to deploy commands to Discord", error, 5, __filename);
  }
}
