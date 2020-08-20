import { IContainer } from "./container";
import { IPort } from "./port";
export interface IBillOfLading {
  id?: number;
  number: string;
  unit: number;
  containers: Array<IContainer>;
  portOfDelivery: IPort | string;
  freeTime: string;
  isSelected?: boolean;
}
