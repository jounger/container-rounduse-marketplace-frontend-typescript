import { IBiddingDocument } from './bidding-document';
export interface ICombined {
  id?: number;
  biddingDocument: IBiddingDocument;
  status: string;
}
