import { IDiscount } from './discount';
export interface IContract {
  id?: number;
  price?: number;
  finesAgainstContractViolation: number;
  discount?: IDiscount;
  required: boolean;
  isSelected?: boolean;
}
