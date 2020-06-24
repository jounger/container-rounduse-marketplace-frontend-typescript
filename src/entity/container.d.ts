import { IDriver } from './driver';
export interface IContainer {
  id?:number;
  containerNumber: string;
  trailer: string;
  tractor: string;
  driver?: IDriver;
  licensePlate: string;
}
