export interface IContractDocument {
  id?: number;
  sender: string;
  documentPath: string;
  status: string;
  isSelected?: boolean;
}
