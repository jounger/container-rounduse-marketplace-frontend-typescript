import { IUser } from "./user";
import { IGeolocation } from './geolocation';
export interface IDriver extends IUser {
  fullname: string;
  driverLicense: string;
  location?: IGeolocation;
}
