import mongoose, { Schema } from "mongoose";
import { IModelGuild } from "../interfaces/modelGuild";

const guildSchema: Schema<IModelGuild> = new Schema({
  name: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  prefix: { type: String, required: true },
  aprovarsetChannelId: { type: String },
  pedirsetChannelId: { type: String },
  recrutamentoCategory: { type: String },
  entryRoleId: { type: String },
  entryRoleRemove: { type: String },
  salesReportChannelId: { type: String },
});

export const ModelGuild = mongoose.model("Guild", guildSchema);
