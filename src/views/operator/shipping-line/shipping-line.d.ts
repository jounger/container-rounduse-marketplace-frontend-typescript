import { UserEntity } from '../../../store/definitions/user';
export interface ShippingLine extends UserEntity {
  id?: number,
  shipName: string,
  nameCode: string,
  website: string,
  icds: Array<string>,
  address: string
}
