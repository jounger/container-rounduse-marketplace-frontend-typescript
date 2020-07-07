export interface IPayment {
  id?: number;
  sender: string;
  recipient: string;
  detail: string;
  amount: number;
  isPaid: boolean;
  type: string;
  paymentDate: string;
}
