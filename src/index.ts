import { Client, IntentsBitField } from "discord.js";
import { logger } from "./util/logger";
import dotenv from 'dotenv'
import { registerEvents } from "./events/registerEvents";
dotenv.config()

logger.info("💫 SCRIPT INITIALIZATION")

// Cria objeto client
const client: Client<boolean> = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
    ]
})

// Lida com os eventos
registerEvents(client)

// Inicializa o client
client.login(process.env.TOKEN)

// Processos não tratados
process.on("SIGINT", function () {
    logger.error(`\x1b[32m%s\x1b[0m`, "\nAplicação desligada com CTRL+C")
    process.exit(1);
});

process.on("uncaughtException", (error) => {
    logger.error(`Erro não tratado`, error)
});

process.on("unhandledRejection", (reason, promise) => {
    logger.error(`Promessa rejeitada sem tratamento`, reason)
});

