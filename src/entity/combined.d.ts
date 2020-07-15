import { IBid } from "./bid";
import { IContract } from "./contract";
export interface ICombined {
  id?: number;
  bid: IBid | number;
  status: string;
  contract?: IContract;
}
