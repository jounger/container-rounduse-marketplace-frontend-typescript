// depend on server response
export interface IContainerType {
  id?: number;
  name: string;
  description: string;
  tareWeight: number;
  payloadCapacity: number;
  cubicCapacity: number;
  internalLength: number;
  internalWidth: number;
  internalHeight: number;
  doorOpeningWidth: number;
  doorOpeningHeight: number;
  unitOfMeasurement: string;
}
