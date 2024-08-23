import { Client, Guild, TextChannel, User } from "discord.js";
import { createEmbed } from "../utils/createEmbed";

type LogLevel = "INFO" | "ERROR" | "WARNING" | "INIT";
type rootLevelNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export class Logger {
  private date = new LoggerDate();
  private color = new Color();
  private root = {
    0: "Error",
    1: "System",
    2: "Database",
    3: "Command",
    4: "Button",
    5: "Discord",
    6: "Message",
  };
  private client?: Client;

  constructor(client: Client) {
    this.client = client;
  }

  convertPath(path: string): string {
    return `Root:\\\\${path.split("src\\")[1]}`;
  }

  async init(filePath: string, root?: rootLevelNumber, guild?: Guild) {
    const path = this.convertPath(filePath);
    const level: LogLevel = "INIT";
    const time = this.date.getTime().formattedTime;

    let message = "";
    message += `[${this.color.msg(level, "verde")}] `;
    message += `${this.color.msg(time, "cinza claro")} `;
    message += `[${this.root[root ?? 1]}] `;
    message += guild ? `[${guild.name}] ` : "";
    message += path;

    console.log(message);
  }




  async info(msg: string, root?: rootLevelNumber, guild?: Guild) {
    const level: LogLevel = "INFO";
    const time = this.date.getTime().formattedTime;

    let message = `[${this.color.msg(level, "ciano")}] `;
    message += `${this.color.msg(time, "cinza claro")} `;
    message += `[${this.root[root ?? 1]}] `;
    message += guild ? `[${guild.name}] ` : "";
    message += `${msg}`;

    console.log(message);
  }



  async error(
    msg: string,
    error: any,
    root: rootLevelNumber,
    filePath: string,
    guild?: Guild,
    user?: User
  ) {
    const path = this.convertPath(filePath);
    const level: LogLevel = "ERROR";
    const time = this.date.getTime().formattedTime;

    let message = "\x1b[0m";
    message += `[${this.color.msg(level, "vermelho claro")}] `;
    message += `${this.color.msg(time, "cinza claro")} `;
    message += `[${this.root[root ?? 1]}] `;
    message += `${user ? `${user} ` : ""}`;
    message += `${this.color.msg(msg, "vermelho claro")} `;

    console.error(message);
    console.error(this.color.msg(`Error path: ${path}`, "vermelho claro"));
    console.error(error);

    try {
      const rpManagerGuild = await this.client?.guilds.resolve("1263326476502044784");
      const channel = (await rpManagerGuild?.channels.resolve(
        "1275590381337051136"
      )) as TextChannel;

      if (guild) {
        const title = `GUILD: ${guild.name}`;

        let description = `**Title:** ${msg}\n`;
        description += `**Level:** ${level}\n`;
        description += `**Root:** ${this.root[root ?? 1]}\n`;
        description += `**User:** ${user ?? ""}\n`;
        description += `**Time:** ${this.date.getTime().formattedDate} ${
          this.date.getTime().formattedTime
        }\n`;
        description += `**Path:** ${this.convertPath(filePath)}\n`;
        description += `\`\`\`${error}\`\`\``;

        const footer = { text: guild.name, iconURL: guild.iconURL() ?? undefined };

        const embed = await createEmbed(
          guild,
          title,
          description,
          footer,
          false,
          true,
          "FF0000"
        );

        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.log(error);
    }
  }


  

  async warn(
    msg: string,
    root: rootLevelNumber,
    filePath: string,
    guild?: Guild,
    user?: User
  ) {
    const path = this.convertPath(filePath);
    const level: LogLevel = "WARNING";
    const time = this.date.getTime().formattedTime;

    let message = "\x1b[0m";
    message += `[${this.color.msg(level, "amarelo")}] `;
    message += `${this.color.msg(time, "cinza claro")} `;
    message += `[${this.root[root ?? 1]}] `;
    message += `${user ? `${user.displayName} ` : ""}`;
    message += `${this.color.msg(msg, "amarelo")} `;

    console.error(message);
    console.error(this.color.msg(`Error path: ${path}`, "vermelho claro"));

    try {
      const rpManagerGuild = await this.client?.guilds.resolve("1263326476502044784");
      const channel = (await rpManagerGuild?.channels.resolve(
        "1275590381337051136"
      )) as TextChannel;

      if (guild) {
        const title = `GUILD: ${guild.name}`;

        let description = `**Title:** ${msg}\n`;
        description += `**Level:** ${level}\n`;
        description += `**Root:** ${this.root[root ?? 1]}\n`;
        description += `**User:** ${user ?? ""}\n`;
        description += `**Time:** ${this.date.getTime().formattedDate} ${
          this.date.getTime().formattedTime
        }\n`;
        description += `**Path:** ${this.convertPath(filePath)}\n`;

        const footer = { text: guild.name, iconURL: guild.iconURL() ?? undefined };

        const embed = await createEmbed(
          guild,
          title,
          description,
          footer,
          false,
          true,
          "00ffff"
        );

        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export class LoggerDate {
  // ajusta a hora para o fuso horário do Brasil
  private timezone: number = 0;
  constructor(timezone?: number) {
    this.timezone = timezone ?? 0;
  }

  getTime() {
    // cria um objeto Date com a hora atual
    const dateUTC = new Date();
    const date = new Date(dateUTC.getTime() + this.timezone * 60000);

    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const ano = date.getFullYear();
    const hora = date.getHours().toString().padStart(2, "0");
    const minuto = date.getMinutes().toString().padStart(2, "0");
    const segundo = date.getSeconds().toString().padStart(2, "0");

    return {
      date: date,
      formattedDate: `${dia}/${mes}/${ano}`,
      formattedTime: `${hora}:${minuto}:${segundo}`,
    };
  }
}

type colorName =
  | "preto"
  | "vermelho"
  | "verde"
  | "amarelo"
  | "azul"
  | "magenta"
  | "ciano"
  | "reset"
  | "cinza claro"
  | "vermelho claro"
  | "amarelo claro"
  | "azul claro";

class Color {
  private codigo = {
    preto: 30,
    vermelho: 31,
    verde: 32,
    amarelo: 33,
    azul: 34,
    magenta: 35,
    ciano: 36,
    branco: 37,
    reset: 0,
    "cinza claro": 90,
    "vermelho claro": 91,
    "amarelo claro": 93,
    "azul claro": 94,
  };

  msg(message: string, color: colorName) {
    return `\x1b[${this.codigo[color]}m${message}\x1b[0m`;
  }
}
