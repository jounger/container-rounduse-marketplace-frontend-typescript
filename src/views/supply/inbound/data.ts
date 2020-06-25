import { IInbound } from "@/entity/inbound";
export const InboundData: IInbound[] = [
  {
    id: 0,
    shippingLine: "APL",
    containerType: "40HC",
    status: "CREATED",
    emptyTime: "2020-12-02T20:20",
    pickUpTime: "2020-12-01T20:20",
    billOfLading: {
      id: 0,
      billOfLadingNumber: "BXAWI203923",
      containers: [
        {
          id: 0,
          containerNumber: "APL2982",
          driver: "driver",
          trailer: "2",
          tractor: "3",
          licensePlate: "90A-H0923",
        }
      ],
      portOfDelivery: "HPH",
      freeTime: "2020-12-05T20:20",
    },
  },
  {
    id: 1,
    shippingLine: "APL",
    containerType: "40HC",
    status: "CREATED",
    emptyTime: "2020-12-02T20:20",
    pickUpTime: "2020-12-01T20:20",
    billOfLading: {
      id: 0,
      billOfLadingNumber: "BXAWI203923",
      containers: [
        {
          id: 0,
          containerNumber: "APL2982",
          driver: "driver",
          trailer: "2",
          tractor: "3",
          licensePlate: "90A-H0923",
        }
      ],
      portOfDelivery: "HPH",
      freeTime: "2020-12-05T20:20",
    },
  },
  {
    id: 2,
    shippingLine: "APL",
    containerType: "40HC",
    status: "CREATED",
    emptyTime: "2020-12-02T20:20",
    pickUpTime: "2020-12-01T20:20",
    billOfLading: {
      id: 0,
      billOfLadingNumber: "BXAWI203923",
      containers: [
        {
          id: 0,
          containerNumber: "APL2982",
          driver: "driver",
          trailer: "2",
          tractor: "3",
          licensePlate: "90A-H0923",
        }
      ],
      portOfDelivery: "HPH",
      freeTime: "2020-12-05T20:20",
    },
  },
  {
    id: 3,
    shippingLine: "APL",
    containerType: "40HC",
    status: "CREATED",
    emptyTime: "2020-12-02T20:20",
    pickUpTime: "2020-12-01T20:20",
    billOfLading: {
      id: 0,
      billOfLadingNumber: "BXAWI203923",
      containers: [
        {
          id: 0,
          containerNumber: "APL2982",
          driver: "driver",
          trailer: "2",
          tractor: "3",
          licensePlate: "90A-H0923",
        }
      ],
      portOfDelivery: "HPH",
      freeTime: "2020-12-05T20:20",
    },
  }
]
