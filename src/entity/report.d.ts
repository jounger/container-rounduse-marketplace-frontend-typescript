import { IBiddingDocument } from "./bidding-document";
import { ISupplier } from './supplier';
export interface IReport {
  id?: number;
  sender: ISupplier | string;
  report: IBiddingDocument | number;
  title: string;
  detail: string;
  status: string;
  sendDate: string;
  isSelected?: boolean;
}
