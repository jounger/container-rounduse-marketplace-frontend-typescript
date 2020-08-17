import { IDiscount } from "./discount";
import { ISupplier } from './supplier';
export interface IContract {
  id?: number;
  sender: ISupplier;
  price?: number;
  containers?: number[];
  finesAgainstContractViolation?: number;
  discount?: IDiscount;
  required: boolean;
  creationDate?: string;
  isSelected?: boolean;
}
