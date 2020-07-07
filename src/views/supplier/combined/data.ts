import { ICombined } from '@/entity/combined';
export const CombinedData: ICombined[] = [
  {
    id: 0,
    bid: {
      id: 0,
          bidder: "forwarder",
          containers: [
            {
              id: 0,
              containerNumber: "APL2982",
              driver: "driver",
              trailer: {
                id: 1,
                type: "T28",
                unitOfMeasurement: "ft",
                licensePlate: "51234",
                numberOfAxles: 1
              },
              tractor: {
                id: 1,
                licensePlate: "51423",
                numberOfAxles: 2
              },
              status: "COMBINED"
            },
            {
              id: 1,
              containerNumber: "APL2982",
              driver: "driver",
              trailer: {
                id: 2,
                type: "T28",
                unitOfMeasurement: "ft",
                licensePlate: "51234",
                numberOfAxles: 1
              },
              tractor: {
                id: 2,
                licensePlate: "51423",
                numberOfAxles: 2
              },
              status: "COMBINED"
            }
          ],
          bidPrice: 2099,
          bidDate: "2020-12-01T20:20",
          bidValidityPeriod: "2020-12-01T20:20",
          dateOfDecision: "2020-12-02T20:20",
          status: "ACCEPTED"
    },
    status: "INFO_RECEIVED"
  }
]
