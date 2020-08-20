import { IPort } from "./port";
export interface IBooking {
  id?: number;
  number: string;
  unit: number;
  cutOffTime: string;
  isFcl: boolean;
  portOfLoading: IPort | string;
  isSelected?: boolean;
}
