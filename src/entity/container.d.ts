import { IContainerSemiTrailer } from "./container-semi-trailer";
import { IContainerTractor } from "./container-tractor";
import { IDriver } from "./driver";
export interface IContainer {
  id?: number;
  number: string;
  trailer: IContainerSemiTrailer | string;
  tractor: IContainerTractor | string;
  driver: IDriver | string;
  status: string;
  isSelected?: boolean;
}
