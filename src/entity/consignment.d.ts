import { IAddress } from './address';
import { ISupply } from './supply';
export interface IConsignment extends ISupply{
  merchantId: string;
  categories: Set<string>;
  packingTime: string;
  packingStation: IAddress;
  bookingNumber: string;
  cutOffTime: string;
  laytime: string;
  payload: number;
  unitOfMeasurement: string;
  portOfLoading: string;
  fcl?: boolean;
}
