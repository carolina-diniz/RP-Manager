import { Logger } from "./classes/logger";
import { database } from "./connections/database.connection";
import { client, discord } from "./connections/discord.connection";
import { events } from "./core/events/events";

export const logger = new Logger(client)

async function initializeBot() {
  console.clear();
  console.log("✨ Started Server");

  await database.connection();
  await discord.connect();
  events.listen();
}

initializeBot();

process.on("SIGINT", function () {
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log(error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(reason);
  console.log(promise);
});
