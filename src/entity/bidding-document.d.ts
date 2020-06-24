import { IMerchant } from "./merchant";
import { IOutbound } from "./outbound";
export interface IBiddingDocument {
  id?: number;
  offeree: IMerchant;
  outbound: IOutbound;
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
