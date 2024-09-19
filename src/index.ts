import { Client, IntentsBitField } from "discord.js";
import { Logger } from "./classes/logger";
import { connect } from "./connect";
import { database } from "./database/database";
import { registerEvents } from "./events/registerEvents";

console.clear();
console.log('✨ Started Server')

export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
  ],
});

export const logger = new Logger(client);

async function main() {
  // inicia database
  await database();

  // connecta ao discord server
  await connect();

  // Lida com os eventos
  await registerEvents();
}

main();

process.on("SIGINT", function () {
  process.exit(1);
});

process.on("uncaughtException", (error) => {});

process.on("unhandledRejection", (reason, promise) => {});
