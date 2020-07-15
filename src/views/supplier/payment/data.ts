import { IPayment } from "@/entity/payment";
export const PaymentData: IPayment[] = [
  {
    id: 2,
    sender: "admin",
    recipient: "merchant",
    detail: "abc",
    amount: 50,
    isPaid: false,
    type: "FINES",
    paymentDate: "2020-08-07T00:00"
  },
  {
    id: 1,
    sender: "admin",
    recipient: "merchant",
    detail: "abc",
    amount: 50,
    isPaid: true,
    type: "PAYMENT",
    paymentDate: "2020-08-07T00:00"
  }
];
