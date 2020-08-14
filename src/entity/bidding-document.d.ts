import { IOutbound } from "./outbound";
import { IBid } from "./bid";
import { IDiscount } from "./discount";
export interface IBiddingDocument {
  id?: number;
  offeree: string; // IMerchant username
  outbound: IOutbound | number;
  bids: Array<IBid>;
  isMultipleAward: boolean;
  bidOpening: string;
  bidClosing: string;
  dateOfDecision: string;
  currencyOfPayment: string;
  bidPackagePrice: number;
  bidFloorPrice: number;
  priceLeadership: number;
  status: string;
  isSelected?: boolean;
}
