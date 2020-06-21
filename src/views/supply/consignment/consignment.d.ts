export interface Consignment {
  id?: number,
  bookNo: string,
  PIC: string,
  packingTime: string,
  packingStation: string,
  layTime: string,
  cutOfTime: string,
  payload: number,
  UOM: number,
  categories: Array<string>,
  FCL: string,
  port: string
}
