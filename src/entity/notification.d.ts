import { IBiddingDocument } from "./bidding-document";
import { ICombined } from "./combined";
import { IReport } from "./report";
import { IUser } from "./user";
import { IShippingInfo } from "./shipping-info";
export interface INotification {
  id?: number;
  recipient: IUser | string;
  title: string;
  message: string;
  type: string;
  sendDate: string;
  isRead: boolean;
  isHide?: boolean;
  isSelected?: boolean;
}

export interface IBiddingNotification extends INotification {
  relatedResource: IBiddingDocument;
  action: string;
}

export interface IReportNotification extends INotification {
  relatedResource: IReport;
  action: string;
}

export interface IDriverNotification extends INotification {
  relatedResource: IShippingInfo;
  action: string;
}

export interface IShippingLineNotification extends INotification {
  relatedResource: ICombined;
  action: string;
}
