import mongoose, { Schema } from "mongoose";
import { IModelGuild } from "../interfaces/modelGuild";

const guildShema: Schema<IModelGuild> = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  prefix: { type: String, default: "[N]" },
  embedColor: { type: String },
  pdChannelId: { type: String },
  recruitmentCategoryId: { type: String },
  pedirsetChannelId: { type: String},
  aprovarsetChannelId: { type: String },
  entryRoleId: { type: [{id: String, name: String}]},
  entryRoleRemoveId: { type: [{id: String, name: String}]},
  reportSalesId: { type: String },
  reportSalesRolesId: { type: [{id: String, percent: Number}]},
  reportChestId: { type: String},
  reportButtonChestId: { type: String},
  hierarquiaMessageId: { type: String },
});

export const ModelGuild = mongoose.model("Guild", guildShema);
