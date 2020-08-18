import { IUser } from './user';
export interface IFileUpload {
  id?: number;
  owner?: IUser;
  name: string;
  originName: string;
  path: string;
  type: number;
}
