import { IContract } from './contract';
import { IUser } from './user';
export interface IRating {
  id?: number;
  sender: IUser | string;
  receiver: IUser | string;
  contract: IContract | string;
  ratingValue: string;
}
