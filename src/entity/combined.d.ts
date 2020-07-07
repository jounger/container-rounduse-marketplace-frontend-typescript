import { IBid } from './bid';
export interface ICombined {
  id?: number;
  bid: IBid;
  status: string;
}
