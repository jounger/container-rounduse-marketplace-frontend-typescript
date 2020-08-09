export interface IBooking {
  id?: number;
  number: string;
  unit: number;
  cutOffTime: string;
  isFcl: boolean;
  portOfLoading: string; // nameCode
  isSelected?: boolean;
}
