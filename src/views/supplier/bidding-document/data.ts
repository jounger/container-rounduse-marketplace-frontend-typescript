import { IBiddingDocument } from "@/entity/bidding-document";
export const BiddingDocumentData: IBiddingDocument[] = [
  {
    id: 0,
    offeree: "merchant",
    outbound: {
      id: 0,
      shippingLine: "APL",
      containerType: "40HC",
      status: "CREATED",
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
          },
          {
            id: 2,
            containerNumber: "APN2982",
            driver: "driver1",
            trailer: "2",
            tractor: "3",
            licensePlate: "90A-H0333",
          },
          {
            id: 3,
            containerNumber: "APX2982",
            driver: "driver1",
            trailer: "2",
            tractor: "3",
            licensePlate: "90A-H0993",
          },
          {
            id: 4,
            containerNumber: "APAX2982",
            driver: "driver1",
            trailer: "2",
            tractor: "3",
            licensePlate: "90A-HA993",
          }
        ],
        bidPrice: 2099,
        bidDate: "2020-12-01T20:20",
        bidValidityPeriod: "2020-12-01T20:20",
        status: "CREATED"
      }
    ],
    bidDiscountCode: "DISCOUNT01",
    isMultipleAward: true,
    bidOpening: "2020-07-01T20:20",
    bidClosing: "2020-07-03T20:20",
    dateOfDecision: "2020-12-02T20:20",
    currencyOfPayment: "VND",
    bidPackagePrice: 200,
    bidFloorPrice: 100,
    priceLeadership: 150,
  },
  {
    id: 1,
    offeree: "merchant",
    outbound: {
      id: 0,
      shippingLine: "APL",
      containerType: "40HC",
      status: "CREATED",
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
    bids: [],
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
  {
    id: 2,
    offeree: "merchant",
    outbound: {
      id: 0,
      shippingLine: "APL",
      containerType: "40HC",
      status: "CREATED",
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
    bids: [],
    bidDiscountCode: "DISCOUNT01",
    isMultipleAward: true,
    bidOpening: "2020-12-01T20:20",
    bidClosing: "2020-12-03T20:20",
    dateOfDecision: "2020-12-02T20:20",
    currencyOfPayment: "VND",
    bidPackagePrice: 200,
    bidFloorPrice: 100,
    priceLeadership: 150,
  }
]
