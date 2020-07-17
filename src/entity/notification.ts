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
