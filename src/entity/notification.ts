export interface INotification {
  id?: number;
  recipient: string; // username
  title: string;
  message: string;
  sendDate: string;
  isRead: boolean;
}
