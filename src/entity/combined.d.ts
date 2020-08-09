import { IBid } from "./bid";
import { IContract } from "./contract";
export interface ICombined {
  id?: number;
  bid: IBid | number;
  contract?: IContract;
  containers?: number[];
  isCanceled?: boolean;
  isSelected?: boolean;
}
