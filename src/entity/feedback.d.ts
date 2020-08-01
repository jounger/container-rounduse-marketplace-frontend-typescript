export interface IFeedback {
  id?: number;
  sender: string;
  recipient: string;
  message: string;
  satisfactionPoints: number;
  sendDate: string;
}
