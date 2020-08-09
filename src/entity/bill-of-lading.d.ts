import { IContainer } from "./container";
export interface IBillOfLading {
  id?: number;
  number: string;
  unit: number;
  containers: Array<IContainer>;
  portOfDelivery: string; // nameCode
  freeTime: string;
  isSelected?: boolean;
}
