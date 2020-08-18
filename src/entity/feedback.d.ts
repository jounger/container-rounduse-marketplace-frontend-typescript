import { IUser } from './user';
export interface IFeedback {
  id?: number;
  sender: IUser | string;
  recipient: IUser | string;
  message: string;
  satisfactionPoints: number;
  sendDate: string;
  isSelected?: boolean;
}
