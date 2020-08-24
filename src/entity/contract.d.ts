import { IDiscount } from "./discount";
import { ISupplier } from "./supplier";
export interface IContract {
  id?: number;
  sender: ISupplier;
  price: number;
  paymentPercentage?: number;
  containers?: number[];
  finesAgainstContractViolations: number;
  discount?: IDiscount;
  required: boolean;
  creationDate?: string;
  isSelected?: boolean;
}
