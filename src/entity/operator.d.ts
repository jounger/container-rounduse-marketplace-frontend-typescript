import { IUser } from "./user";
export interface IOperator extends IUser {
  isRoot: boolean;
}
