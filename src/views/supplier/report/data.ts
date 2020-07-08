import { IReport } from "@/entity/report";
export const ReportData: IReport[] = [
  {
    id: 1,
    sender: "merchant",
    report: {
      id: 1,
      offeree: "merchant",
      outbound: {
        id: 1,
        shippingLine: "APL",
        containerType: "40HC",
        status: "COMBINED",
        goodsDescription: "Hàng mềm",
        packingTime: "2020-07-13T00:00",
        packingStation: "HN",
        deliveryTime: "2020-07-14T00:00",
        grossWeight: 2000,
        unitOfMeasurement: "KG",
        booking: {
          id: 0,
          bookingNumber: "51243",
          unit: 1,
          cutOffTime: "2020-07-18T00:00",
          isFcl: true,
          portOfLoading: "HAIPHONGPORT"
        }
      },
      bids: [
        {
          id: 1,
          bidder: "forwarder",
          containers: [
            {
              id: 1,
              containerNumber: "54612",
              trailer: {
                id: 1,
                type: "T28",
                unitOfMeasurement: "ft",
                licensePlate: "51432",
                numberOfAxles: 2
              },
              tractor: {
                id: 1,
                licensePlate: "51423",
                numberOfAxles: 2
              },
              driver: "DRIVER",
              status: "COMBINED"
            }
          ],
          bidPrice: "2000000",
          bidDate: "2020-07-08T00:00",
          bidValidityPeriod: "2020-07-09T00:00",
          dateOfDecision: "2020-07-10T00:00",
          status: "ACCEPTED"
        }
      ],
      discount: "12345",
      isMultipleAward: false,
      bidOpening: "2020-07-08T00:00",
      bidClosing: "2020-07-11T00:00",
      dateOfDecision: "2020-07-10T00:00",
      currencyOfPayment: "VND",
      bidPackagePrice: 2000000,
      bidFloorPrice: 1500000,
      priceLeadership: 2000000,
      status: "COMBINED"
    },
    title: "Trễ hẹn trả tiền",
    detail: "Bên Forwarder không chịu trả tiền",
    status: "PENDING"
  }
];
