import { IOutbound } from "./outbound";
import { IBid } from './bid';
export interface IBiddingDocument {
  id?: number;
  offeree: string; // IMerchant username
  outbound: IOutbound;
  bids: Array<IBid>;
  bidDiscountCode: string;
  isMultipleAward: boolean;
  bidOpening: string;
  bidClosing: string;
  dateOfDecision: string;
  currencyOfPayment: string;
  bidPackagePrice: number;
  bidFloorPrice: number;
  priceLeadership: number;
}
