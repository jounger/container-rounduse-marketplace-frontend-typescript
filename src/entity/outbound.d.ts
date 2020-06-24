import { ISupply } from './supply';
import { IBooking } from './booking';
export interface IOutbound extends ISupply {
  goodsDescription: string;
  packingTime: string;
  packingStation: string;
  grossWeight: number;
  unitOfMesurement: string;
  booking: IBooking;
}
