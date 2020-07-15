import { ISupply } from "./supply";
import { IBillOfLading } from "./bill-of-lading";
export interface IInbound extends ISupply {
  emptyTime: string;
  pickupTime: string;
  billOfLading: IBillOfLading;
  returnStation: string;
}
