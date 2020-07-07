export interface IContract {
  id?: number;
  sender: string;
  finesAgainstContractViolations: number;
  evidence: string;
  isValid: boolean;
  required: boolean;
}
