/**
 * @file index.ts
 * @description Inicializa o cliente do Discord, conecta ao banco de dados, registra eventos e lida com sinais de processo.
 */
import { Client, IntentsBitField } from "discord.js";
import { Logger } from "./classes/logger";
import { connect } from "./connect";
import { database } from "./database/database";
import { registerEvents } from "./events/registerEvents";

console.clear();
console.log("✨ Started Server");

/**
 * @constant {Client} client - Instância do cliente do Discord com as intenções especificadas.
 */
export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
  ],
});

/**
 * @constant {Logger} logger - Instância do logger personalizado para o cliente do Discord.
 */
export const logger = new Logger(client);

/**
 * Função principal que inicializa a aplicação.
 *
 * @async
 * @function initializeBot
 * @returns {Promise<void>} - Uma promessa que resolve quando todas as operações assíncronas são concluídas.
 * @description Esta função inicializa o banco de dados, conecta ao servidor do Discord e registra os eventos.
 */
async function initializeBot() {
  // inicia database
  await database();

  // connecta ao discord server
  await connect();

  // Lida com os eventos
  await registerEvents();
}

initializeBot();

/**
 * Evento de sinal de interrupção do processo.
 *
 * @event process#SIGINT
 * @description Encerra o processo com o código de saída 1 quando o sinal SIGINT é recebido.
 */
process.on("SIGINT", function () {
  process.exit(1);
});

/**
 * Evento de exceção não capturada.
 *
 * @event process#uncaughtException
 * @param {Error} error - O erro não capturado.
 * @description Lida com exceções não capturadas no processo.
 */
process.on("uncaughtException", (error) => {});

/**
 * Evento de rejeição não tratada.
 *
 * @event process#unhandledRejection
 * @param {any} reason - A razão da rejeição não tratada.
 * @param {Promise<any>} promise - A promessa que foi rejeitada.
 * @description Lida com rejeições de promessas não tratadas no processo.
 */
process.on("unhandledRejection", (reason, promise) => {});
