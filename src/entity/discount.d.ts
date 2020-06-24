export interface IDiscount {
  id?: number;
  code: string;
  detail: string;
  currency: string;
  percent: number;
  maximumDiscount: number;
  expiredDate: string;
}
