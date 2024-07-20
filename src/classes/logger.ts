import { Interaction } from "discord.js";
import { getDate } from "../util/getDate";
import { getNickname } from "../util/getNickname";

export class Logger {
  private guildName: string = "";
  private userName: string = "";
  private path: string = "";

  constructor(path: string) {
    this.path = path
  }

  async config(interaction: Interaction) {
    this.setGuildName(interaction.guild!.name);
    const nickname = await getNickname({ interaction });
    this.setUserName(nickname ?? "not found");
  }

  setGuildName(guildName: string): string {
    this.guildName = guildName;
    return this.guildName;
  }
  setUserName(userName: string): string {
    this.userName = userName;
    return this.userName;
  }

  setPath(path: string): string {
    this.path = path;
    return this.path;
  }


  command = {
    info: (message: string) => {
      console.log(
        `${getDate().string} [${this.guildName}] [command] [info] <${
          this.userName
        }>: ${message}`
      );
    },
    warn: (message: string) => {
      console.log(
        `${getDate().string} [${this.guildName}] [command] [warn] <${
          this.userName
        }>: ${message}`
      );
    },
    error: (message: string, error: any) => {
      console.log('_______________________ERROR_______________________')
      console.log(`${getDate().string} [${this.guildName}] [command] [error] <${this.userName}>: ${message}`)
      console.log(`Error Path: ${this.path}`)
      console.log(error)
      console.log('___________________________________________________')
    }
  };
  button = {
    info: (message: string) => {
      console.log(
        `${getDate().string} [${this.guildName}] [button] [info] <${
          this.userName
        }>: ${message}`
      );
    },
    warn: (message: string) => {
      console.log(
        `${getDate().string} [${this.guildName}] [button] [warn] <${
          this.userName
        }>: ${message}`
      );
    },
    error: (message: string, error: any) => {
      console.log('_______________________ERROR_______________________')
      console.log(`${getDate().string} [${this.guildName}] [button] [error] <${this.userName}>: ${message}`)
      console.log(`Error Path: ${this.path}`)
      console.log(error)
      console.log('___________________________________________________')
    }
  };
  system = {
    info: (message: string) => {
      console.log(
        `${getDate().string} [${this.guildName}] [system] [info] <${
          this.userName
        }>: ${message}`
      );
    },
    warn: (message: string) => {
      console.log(
        `${getDate().string} [${this.guildName}] [system] [warn] <${
          this.userName
        }>: ${message}`
      );
    },
    error: (message: string, error: any) => {
      console.log('_______________________ERROR_______________________')
      console.log(`${getDate().string} [${this.guildName}] [system] [error] <${this.userName}>: ${message}`)
      console.log(`Error Path: ${this.path}`)
      console.log(error)
      console.log('___________________________________________________')
    }
  };

  database = {
    info: (message: string, modelName: string) => {
      console.log(
        `${getDate().string} [${this.guildName}] [database] [${modelName}] [info] <${
          this.userName
        }>: ${message}`
      );
    },
    warn: (message: string, modelName: string) => {
      console.log(
        `${getDate().string} [${this.guildName}] [database] [${modelName}] [warn] <${
          this.userName
        }>: ${message}`
      );
    },
    error: (message: string, modelName: string, error: any) => {
      console.log('_______________________ERROR_______________________')
      console.log(`${getDate().string} [${this.guildName}] [database] [${modelName}] [error] <${this.userName}>: ${message}`)
      console.log(`Error Path: ${this.path}`)
      console.log(error)
      console.log('___________________________________________________')
    }
  };
}
