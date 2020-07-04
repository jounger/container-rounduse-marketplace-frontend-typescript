import { ICombined } from '@/entity/combined';
export const CombinedData: ICombined[] = [
  {
    id: 0,
    biddingDocument: {
      id: 0,
      offeree: "merchant",
      outbound: {
        id: 0,
        shippingLine: "APL",
        containerType: "40HC",
        status: "ACCEPTED",
        goodsDescription: "Hàng dệt may",
        packingTime: "2020-12-01T20:20",
        packingStation: "Hà Nội",
        payload: 2000,
        unitOfMeasurement: "KG",
        booking: {
          bookingNumber: "ABC012",
          unit: 2,
          cutOffTime: "2020-12-05T20:20",
          isFcl: true,
          portOfLoading: "HPH"
        }
      },
      bids: [
        {
          id: 0,
          bidder: "forwarder",
          containers: [
            {
              id: 0,
              containerNumber: "APL2982",
              driver: "driver",
              trailer: "2",
              tractor: "3",
              licensePlate: "90A-H0923",
            },
            {
              id: 1,
              containerNumber: "APA2982",
              driver: "driver1",
              trailer: "2",
              tractor: "3",
              licensePlate: "90A-H0933",
            }
          ],
          bidPrice: 2099,
          bidDate: "2020-12-01T20:20",
          bidValidityPeriod: "2020-12-01T20:20",
          dateOfDecision: "2020-12-02T20:20",
          status: "ACCEPTED"
        },
        {
          id: 1,
          bidder: "forwarder",
          containers: [
            {
              id: 2,
              containerNumber: "APC2982",
              driver: "driver2",
              trailer: "2",
              tractor: "3",
              licensePlate: "90A-H0A23",
            },
            {
              id: 3,
              containerNumber: "APAE982",
              driver: "driver3",
              trailer: "2",
              tractor: "3",
              licensePlate: "90A-H0F33",
            }
          ],
          bidPrice: 2087,
          bidDate: "2020-12-01T20:20",
          bidValidityPeriod: "2020-12-01T20:20",
          dateOfDecision: "2020-12-02T20:20",
          status: "ACCEPTED"
        }
      ],
      bidDiscountCode: "DISCOUNT01",
      isMultipleAward: true,
      bidOpening: "2020-12-01T20:20",
      bidClosing: "2020-12-03T20:20",
      dateOfDecision: "2020-12-02T20:20",
      currencyOfPayment: "VND",
      bidPackagePrice: 200,
      bidFloorPrice: 100,
      priceLeadership: 150,
    },
    status: "INFO_RECEIVED"
  }
]
