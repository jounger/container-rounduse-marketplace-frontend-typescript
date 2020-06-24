import { ISupply } from "./supply";
import { IBillOfLading } from "./bill-of-lading";
export interface IInbound extends ISupply {
  emptyTime: string;
  pickUpTime: string;
  billOfLading: IBillOfLading;
}
