import { IBiddingDocument } from './bidding-document';
export interface IReport {
  id?: number;
  sender: string;
  report: IBiddingDocument;
  title: string;
  detail: string;
  status: string;
}
