import { IUser } from './user';
export interface IOperator extends IUser {
  fullname: string;
  isRoot: boolean;
}
