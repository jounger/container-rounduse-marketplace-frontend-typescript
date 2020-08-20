import { IContainer } from "./container";
import { IForwarder } from "./forwarder";
export interface IBid {
  id?: number;
  bidder: IForwarder | string;
  containers: Array<IContainer> | Array<number>;
  bidPrice: number | string;
  bidDate: string;
  validityPeriod: string;
  freezeTime?: string;
  dateOfDecision?: string;
  status: string;
  isSelected?: boolean;
}
