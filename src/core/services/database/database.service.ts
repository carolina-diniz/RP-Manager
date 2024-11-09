import { Document, Types } from "mongoose";
import { IModelGuild } from "../../interfaces/modelGuild";
import { ModelGuild } from "../../models/modelGuild";

type guildDocument = Document<unknown, {}, IModelGuild> &
  IModelGuild & {
    _id: Types.ObjectId;
  };

export const database = {
  getGuild: async (guildId: string): Promise<guildDocument | null> => {
    return await ModelGuild.findOne({ guildId });
  },
};
