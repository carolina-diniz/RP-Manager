import { model, Schema } from "mongoose";
import { IModelSales } from "../interfaces/modelSales";

const salesSchema: Schema<IModelSales> = new Schema({
  guildId: { type: String, required: true },
  messageId: { type: String, required: true, unique: true },
  memberId: { type: String, required: true },
  items: { type: [], required: true },
  saleValor: { type: Number, required: true },
  depositValor: { type: Number, required: true },
  percent: { type: Number, required: true },
  partnership: { type: Boolean, required: true },
  createAt: { type: Date, required: true },
});

export const ModelSales = model('Sales', salesSchema)
