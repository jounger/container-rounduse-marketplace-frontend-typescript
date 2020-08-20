import { IBiddingDocument } from "./bidding-document";
import { INotification } from "./notification";
export interface IBiddingNotification extends INotification {
  relatedResource: IBiddingDocument;
  action: string;
}
