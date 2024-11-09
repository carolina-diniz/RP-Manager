import { Client, IntentsBitField } from 'discord.js';
import 'dotenv/config'

export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
  ],
});

export const discord = {
  connect: async () => {
    try {
      const TOKEN = process.env.TOKEN;

      if (!TOKEN) throw new Error('TOKEN is required');

      await client.login(TOKEN)
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}