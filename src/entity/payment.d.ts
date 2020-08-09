export interface IPayment {
  id?: number;
  sender: string;
  recipient: string;
  contract?: number;
  detail: string;
  amount: number;
  isPaid: boolean;
  type: string;
  paymentDate: string;
  isSelected?: boolean;
}
