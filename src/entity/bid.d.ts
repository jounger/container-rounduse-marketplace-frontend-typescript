import { IContainer } from './container';
export interface IBid {
  id?: number;
  containers: Set<IContainer>;
  bidPrice: number;
  bidDate: string;
  bidValidityPeriod: string;
  status: string;
}
