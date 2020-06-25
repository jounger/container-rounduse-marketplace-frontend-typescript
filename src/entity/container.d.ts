import { IDriver } from "./driver";
export interface IContainer {
  id?: number;
  containerNumber: string;
  trailer: string;
  tractor: string;
  driver?: string; // driver username
  licensePlate: string;
}
