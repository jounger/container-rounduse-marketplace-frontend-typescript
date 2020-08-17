import { IShippingLine } from './shipping-line';
import { IContainerType } from './container-type';
export interface ISupply {
  id?: number;
  code: string;
  shippingLine: IShippingLine | string;
  containerType: IContainerType | string;
  status: string;
  isSelected?: boolean;
}
