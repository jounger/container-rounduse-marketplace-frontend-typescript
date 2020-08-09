export interface IEvidence {
  id?: number;
  sender: string;
  evidence: string;
  isValid: boolean;
  isSelected?: boolean;
}
