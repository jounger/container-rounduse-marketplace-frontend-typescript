import { IContainer } from './container';
import { IPort } from './port';
export interface IBillOfLading {
  id?: number;
  billOfLadingNumber: string;
  containers: Set<IContainer>
  portOfDelivery: IPort;
  freeTime: string;
}
