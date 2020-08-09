import { IBiddingDocument } from "./bidding-document";
export interface IReport {
  id?: number;
  sender: string;
  report: number | IBiddingDocument;
  title: string;
  detail: string;
  status: string;
  sendDate: string;
  isSelected?: boolean;
}
