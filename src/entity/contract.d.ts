import { IEvidence } from "./evidence";
export interface IContract {
  id?: number;
  finesAgainstContractViolation: number;
  required: boolean;
}
