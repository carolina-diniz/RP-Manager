import { Message } from "discord.js";

export async function verifyLinks(message: Message): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (
        message.content.toLowerCase().includes('steamcommunity') ||
        message.content.toLowerCase().includes('discord.gg')
      ) {
        throw new Error("mensagem com conteúdo não autorizado.")
      }
      resolve()
    } catch (error) {
      message.delete()
      reject(error)
    }
  })
}