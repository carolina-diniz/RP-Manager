import { Client, Guild, Interaction } from "discord.js";
import { onGuildAvailable } from "./on-GuildAvailable/onGuildAvailable";
import { onGuildCreate } from "./on-GuildCreate/onGuildCreate";
import { onGuildDelete } from "./on-GuildDelete/onGuildDelete";
import { onInteractionCreate } from "./on-InteractionCreate/onInteractionCreate";
import { onReady } from "./on-ready/onReady";

export function registerEvents(client: Client) {
    client
    .once('ready', onReady)
    .on('guildAvailable', (guild: Guild) => onGuildAvailable(guild, client))
    .on('guildCreate', (guild: Guild) => onGuildCreate(guild, client))
    .on('interactionCreate', (interaction: Interaction) => onInteractionCreate(interaction, client))
    .on('guildDelete', (guild: Guild) => onGuildDelete(guild, client))
} 