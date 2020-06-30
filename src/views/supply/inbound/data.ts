import { IInbound } from "@/entity/inbound";
export const InboundData: IInbound[] = [
  {
    id: 0,
    shippingLine: "APL",
    containerType: "40HC",
    status: "CREATED",
    emptyTime: "2020-12-02T20:20",
    pickupTime: "2020-12-01T20:20",
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
        },
        {
          id: 1,
          containerNumber: "APL2A82",
          driver: "driver",
          trailer: "2",
          tractor: "3",
          licensePlate: "90A-HZ923",
        },
        {
          id: 2,
          containerNumber: "APL0982",
          driver: "driver",
          trailer: "2",
          tractor: "3",
          licensePlate: "90A-H0023",
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
    pickupTime: "2020-12-01T20:20",
    billOfLading: {
      id: 0,
      billOfLadingNumber: "BXAWI203923",
      containers: [
        {
          id: 3,
          containerNumber: "APA2982",
          driver: "driver",
          trailer: "2",
          tractor: "3",
          licensePlate: "90A-HW923",
        },
        {
          id: 4,
          containerNumber: "APG2982",
          driver: "driver",
          trailer: "2",
          tractor: "3",
          licensePlate: "90A-HV923",
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
    pickupTime: "2020-12-01T20:20",
    billOfLading: {
      id: 0,
      billOfLadingNumber: "BXAWI203923",
      containers: [
        {
          id: 5,
          containerNumber: "APL3982",
          driver: "driver",
          trailer: "2",
          tractor: "3",
          licensePlate: "90A-H0323",
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
    pickupTime: "2020-12-01T20:20",
    billOfLading: {
      id: 0,
      billOfLadingNumber: "BXAWI203923",
      containers: [
        {
          id: 6,
          containerNumber: "APC2982",
          driver: "driver",
          trailer: "2",
          tractor: "3",
          licensePlate: "90A-Z0923",
        }
      ],
      portOfDelivery: "HPH",
      freeTime: "2020-12-05T20:20",
    },
  }
]
