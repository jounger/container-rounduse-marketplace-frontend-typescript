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
      grossWeight: 2000,
      unitOfMesurement: "KG",
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
      grossWeight: 2000,
      unitOfMesurement: "KG",
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
      grossWeight: 2000,
      unitOfMesurement: "KG",
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
