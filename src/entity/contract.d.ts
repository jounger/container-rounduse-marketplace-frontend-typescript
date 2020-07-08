import { IEvidence } from "./evidence";
export interface IContract {
  id?: number;
  finesAgainstContractViolations: number;
  evidence: IEvidence;
  required: boolean;
}
