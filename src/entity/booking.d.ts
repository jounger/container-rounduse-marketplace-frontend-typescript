import { IPort } from './port';
export interface IBooking {
  id?: number;
  bookingNumber: string;
  unit: number;
  cutOffTime: string;
  isFcl: boolean;
  portOfLoading: IPort;
}
