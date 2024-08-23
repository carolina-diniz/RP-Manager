import { Document, Types } from "mongoose";
import { logger } from "..";
import { IModelGuild } from "../interfaces/modelGuild";
import { ModelGuild } from "../models/modelGuild";

export async function getGuild(
  guildId: string
): Promise<
  (Document<unknown, {}, IModelGuild> & IModelGuild & { _id: Types.ObjectId }) | null
> {
  return new Promise(async (resolve, reject) => {
    try {
      const guildDb = await ModelGuild.findOne({
        guildId: guildId,
      });
      resolve(guildDb);
    } catch (error) {
      logger.error("Failed to get guild from database", error, 2, __filename);
      reject(error);
    }
  });
}
