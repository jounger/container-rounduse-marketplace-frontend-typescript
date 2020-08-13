export interface IEvidence {
  id?: number;
  sender: string;
  documentPath: string;
  isValid: boolean;
  isSelected?: boolean;
}
