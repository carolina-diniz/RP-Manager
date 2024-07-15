import { Client } from "discord.js";
import { onReady } from "./on-ready/onReady";

export function registerEvents(client: Client) {
    client
    .once('ready', onReady)
}