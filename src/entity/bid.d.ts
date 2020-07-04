import { IContainer } from "./container";
export interface IBid {
  id?: number;
  bidder: string;
  containers: Array<IContainer> | Array<number>;
  bidPrice: number | string;
  bidDate: string;
  bidValidityPeriod: string;
  dateOfDecision?: string;
  status: string;
}
