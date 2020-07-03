import { IContainer } from "./container";
export interface IBid {
  id?: number;
  containers: Array<IContainer> | Array<number>;
  bidPrice: number | string;
  bidDate: string;
  bidValidityPeriod: string;
  status: string;
}
