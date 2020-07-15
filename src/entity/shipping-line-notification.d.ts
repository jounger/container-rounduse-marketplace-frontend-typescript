import { INotification } from './notification';
import { ICombined } from './combined';
export interface IShippingLineNotification extends INotification{
  relatedResource: ICombined;
  type: string;
}
