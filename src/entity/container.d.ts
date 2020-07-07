import { IContainerSemiTrailer } from './container-semi-trailer';
import { IContainerTractor } from './container-tractor';
export interface IContainer {
  id?: number;
  containerNumber: string;
  trailer: IContainerSemiTrailer;
  tractor: IContainerTractor;
  driver: string; // driver username
  status: string;
}
