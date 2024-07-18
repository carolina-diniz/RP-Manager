import mongoose, { Schema } from "mongoose";
import { IMember } from "../interfaces/modelMember";

const memberSchema: Schema<IMember> = new Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  IGName: {
    type: String || null,
  },
  IGId: {
    type: String || null,
  },
  nickname: {
    type: String || null,
  },
  guildId: {
    type: String,
    required: true
  },
  user: {
    globalName: {
      type: String || null,
    },
    createdTimestamp: {
      type: Number,
      required: true
    },
    tag: {
      type: String,
      required: true
    },
    bot: {
      type: Boolean,
      required: true
    },
    displayName: {
      type: String,
      required: true
    },
    id: {
      type: String,
      unique: true,
      required: true
    },
    username: {
      type: String,
      required: true
    },
  },
  pd: {
    isPemaBanned: {
      type: Boolean,
      required: true
    },
    permaDeathReason: {
      type: String,
    },
    whoBanned: {
      type: String || null,
    },
  },
  joinedAt: {
    type: Date,
    required: true
  },
  leftAt: {
    type: Date
  },
});

export const ModelMember = mongoose.model('Member', memberSchema)

//35966
