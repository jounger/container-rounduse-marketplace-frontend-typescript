import { IBiddingNotification } from "@/entity/bidding-notification";
export const IBiddingNotificationData: IBiddingNotification[] = [
  {
    id: 100,
    recipient: "merchant",
    isRead: false,
    relatedResource: {
      id: 0,
      offeree: "merchant",
      outbound: {
        id: 0,
        shippingLine: "APL",
        containerType: "40HC",
        status: "CREATED",
        goodsDescription: "Hàng dệt may",
        packingTime: "2020-12-01T20:20",
        deliveryTime: "2020-12-01T25:20",
        packingStation: "Hà Nội",
        grossWeight: 2000,
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
      discount: "DISCOUNT01",
      isMultipleAward: true,
      bidOpening: "2020-12-01T20:20",
      bidClosing: "2020-12-03T20:20",
      dateOfDecision: "2020-12-02T20:20",
      currencyOfPayment: "VND",
      bidPackagePrice: 200,
      bidFloorPrice: 100,
      priceLeadership: 150,
      status: "BIDDING"
    },
    sendDate: "2016-06-20",
    title: "message",
    message: "Day la message",
    type: "CREATED"
  },
  {
    id: 100,
    recipient: "merchant",
    isRead: false,
    relatedResource: {
      id: 0,
      offeree: "merchant",
      outbound: {
        id: 0,
        shippingLine: "APL",
        containerType: "40HC",
        status: "CREATED",
        goodsDescription: "Hàng dệt may",
        packingTime: "2020-12-01T20:20",
        deliveryTime: "2020-12-01T25:20",
        packingStation: "Hà Nội",
        grossWeight: 2000,
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
      discount: "DISCOUNT01",
      isMultipleAward: true,
      bidOpening: "2020-12-01T20:20",
      bidClosing: "2020-12-03T20:20",
      dateOfDecision: "2020-12-02T20:20",
      currencyOfPayment: "VND",
      bidPackagePrice: 200,
      bidFloorPrice: 100,
      priceLeadership: 150,
      status: "BIDDING"
    },
    sendDate: "2016-06-20",
    title: "message",
    message: "Day la message",
    type: "CREATED"
  }
];
