import { IOutbound } from "./outbound";
import { IBid } from './bid';
import { IDiscount } from './discount';
export interface IBiddingDocument {
  id?: number;
  merchant: string; // IMerchant username
  outbound: IOutbound | number;
  bids: Array<IBid>;
  discount?: string;
  isMultipleAward: boolean;
  bidOpening: string;
  bidClosing: string;
  dateOfDecision: string;
  currencyOfPayment: string;
  bidPackagePrice: number;
  bidFloorPrice: number;
  priceLeadership: number;
  status: string;
}
