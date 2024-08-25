import { client } from "..";
import { onChannelDelete } from "./onChannelDelete";
import { onGuildAvailable } from "./onGuildAvailable";
import { onGuildCreate } from "./onGuildCreate";
import { onInteractionCreate } from "./onInteractionCreate";
import { onMessageCreate } from "./onMessageCreate";
import { onMessageDelete } from "./onMessageDelete";
import { onReady } from "./onReady";

export function registerEvents() {
  client
    .once("ready", onReady)
    .on("channelCreate", () => {})
    .on("channelDelete", onChannelDelete)
    .on("channelUpdate", () => {})
    .on("guildAvailable", onGuildAvailable)
    .on("guildBanAdd", () => {})
    .on("guildBanRemove", () => {})
    .on("guildCreate", onGuildCreate)
    .on("guildDelete", () => {})
    .on("guildUpdate", () => {})
    .on("guildMemberAdd", () => {})
    .on("guildMemberRemove", () => {})
    .on("guildMemberUpdate", () => {})
    .on("interactionCreate", onInteractionCreate)
    .on("messageCreate", onMessageCreate)
    .on("messageDelete", onMessageDelete)
    .on("messageUpdate", () => {})
    .on("roleCreate", () => {})
    .on("roleDelete", () => {})
    .on("roleUpdate", () => {});
}
