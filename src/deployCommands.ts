/**
 * Implementa a função de deploy de comandos para um servidor do Discord.
 * 
 * @interface IDeployConfig
 * @property {string} guildId - O ID do servidor (guild) onde os comandos serão implantados.
 * @property {string} clientId - O ID do cliente (bot) que está implantando os comandos.
 * 
 * @function deployCommands
 * @param {IDeployConfig} deployConfig - Configuração necessária para o deploy dos comandos.
 * @returns {Promise<void>} - Uma promessa que resolve quando os comandos são implantados com sucesso.
 * 
 * @throws {Error} - Lança um erro se a implantação dos comandos falhar.
 * 
 * @example
 * ```typescript
 * const deployConfig = {
 *   guildId: "123456789012345678",
 *   clientId: "987654321098765432"
 * };
 * 
 * deployCommands(deployConfig)
 *   .then(() => console.log("Comandos implantados com sucesso"))
 *   .catch((error) => console.error("Erro ao implantar comandos", error));
 * ```
 */
import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { logger } from ".";
import { commands } from "./commands/commands";
dotenv.config();

const TOKEN: string | undefined = process.env.TOKEN;

if (!TOKEN) {
  logger.error("Token not defined in environment variables.", null, 5, __filename);
  process.exit(1);
}

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
    logger.info(`${data.length} commands successfully deployed to Discord`, 5);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to deploy commands to Discord: ${error.message}`, error, 5, __filename);
    } else {
      logger.error(`Failed to deploy commands to Discord`, error, 5, __filename);
    }
  }
}
