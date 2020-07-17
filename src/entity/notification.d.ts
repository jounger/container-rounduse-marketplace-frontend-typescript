import { IBiddingDocument } from './bidding-document';
import { ICombined } from './combined';
import { IOutbound } from './outbound';
import { IReport } from './report';
export interface INotification {
  id?: number;
  recipient: string; // username
  title: string;
  message: string;
  type: string;
  sendDate: string;
  isRead: boolean;
  isHide?: boolean;
}

export interface IBiddingNotification extends INotification {
  relatedResource: IBiddingDocument;
  actions: string;
}

export interface IReportNotification extends INotification {
  relatedResource: IReport;
  actions: string;
}

export interface IDriverNotification extends INotification {
  relatedResource: IOutbound;
  actions: string;
}

export interface IShippingLineNotification extends INotification {
  relatedResource: ICombined;
  actions: string;
}
