import { ISupply } from "./supply";
import { IBooking } from "./booking";
export interface IOutbound extends ISupply {
  goodsDescription: string;
  packingTime: string;
  packingStation: string;
  payload: number;
  unitOfMeasurement: string;
  booking: IBooking;
}
