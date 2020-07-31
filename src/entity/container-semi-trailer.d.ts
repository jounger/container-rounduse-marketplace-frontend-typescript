import { IVehicle } from "./vehicle";
export interface IContainerSemiTrailer extends IVehicle {
  type: string;
  unitOfMeasurement: string;
}
