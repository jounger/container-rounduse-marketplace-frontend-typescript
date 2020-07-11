import { IBiddingDocument } from './bidding-document';
export interface IReport {
  id?: number;
  sender: string;
  report: number;
  title: string;
  detail: string;
  status: string;
}
