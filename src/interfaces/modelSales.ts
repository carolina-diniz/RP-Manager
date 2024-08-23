export interface IModelSales {
  guildId: string;
  messageId: string;
  memberId: string;
  items: { item: string; quant: number }[];
  saleValor: number;
  depositValor: number;
  percent: number;
  partnership: boolean;
  createAt: Date;
}
