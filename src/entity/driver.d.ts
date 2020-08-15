import { IUser } from "./user";
import { IGeolocation } from "./geolocation";
export interface IDriver extends IUser {
  driverLicense: string;
  location?: IGeolocation;
}
