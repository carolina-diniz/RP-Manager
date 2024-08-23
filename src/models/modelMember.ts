import { model, Schema } from "mongoose";
import { IModelMember } from "../interfaces/modelMember";

const memberSchema: Schema<IModelMember> = new Schema({
  guildId: { type: String, required: true },
  memberId: { type: String, required: true },
  nickname: { type: String, required: true },
  nameIG: { type: String, required: true },
  idIG: { type: String, required: true },
  isOnDiscord: { type: Boolean, required: true, default: false },
  alreadyBanned: { type: Boolean, required: true },
  allowedBy: { type: String, required: true},
  recruiterId: { type: String, required: true },
  createdAt: { type: Date, required: true}
});

export const ModelMember = model('Member', memberSchema)