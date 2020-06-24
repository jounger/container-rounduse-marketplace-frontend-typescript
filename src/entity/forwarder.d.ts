import { ISupplier } from "./supplier";
import { IDriver } from "./driver";
export interface IForwarder extends ISupplier {
  drivers?: Array<IDriver>;
}
