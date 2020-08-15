import { IContainer } from "./container";
import { IForwarder } from './forwarder';
export interface IBid {
  id?: number;
  bidder: IForwarder | string;
  containers: Array<IContainer> | Array<number>;
  bidPrice: number | string;
  bidDate: string;
  bidValidityPeriod: string;
  dateOfDecision?: string;
  status: string;
  isSelected?: boolean;
}
