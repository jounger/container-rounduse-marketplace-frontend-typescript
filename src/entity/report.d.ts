import { IBiddingDocument } from "./bidding-document";
import { IUser } from "./user";
export interface IReport {
  id?: number;
  sender: IUser | string;
  report: number | IBiddingDocument;
  title: string;
  detail: string;
  status: string;
  sendDate: string;
  isSelected?: boolean;
}
