import { IOutbound } from './outbound';
import { IContainer } from './container';
export interface IShippingInfo {
  id?: number;
  outbound: IOutbound;
  container: IContainer;
  status: string;
}
