import { IContainer } from "./container";
import { IPort } from "./port";
export interface IBillOfLading {
  id?: number;
  billOfLadingNumber: string;
  containers: Array<IContainer>;
  portOfDelivery: IPort;
  freeTime: string;
}
