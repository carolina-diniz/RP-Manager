import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { commands } from "../../commands/commands";
dotenv.config();

export async function deployCommands(guildId: string, clientId: string) {
  const TOKEN: string | undefined = process.env.TOKEN;
  const rest: REST = new REST({ version: "10" }).setToken(TOKEN!);
  const commandsData = Object.values(commands).map((command) => command.data);

  try {
    let data: any = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commandsData,
    });

    console.log(`${data.length} commands successfully deployed to Discord`);
  } catch (error) {
    console.error(`Failed to deploy commands to Discord`);

    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}
