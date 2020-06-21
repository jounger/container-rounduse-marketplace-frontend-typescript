export interface Container {
  id?:number,
  containerNumber: string,
  containerTrailer: string,
  containerTractor: string,
  blNumber: string,
  driver: Array<string>,
  licensePlate: string,
  emptyTime: string,
  pickUpTime: string,
  returnStation: string,
  freeTime: string,
  port: string
}
