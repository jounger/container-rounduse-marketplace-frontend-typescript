import { IContract } from "@/entity/contract";
export const ContractData: IContract[] = [
  {
    id: 0,
    sender: "merchant",
    finesAgainstContractViolations: 50,
    evidence: "abc",
    isValid: false,
    required: false
  },
  {
    id: 1,
    sender: "merchant",
    finesAgainstContractViolations: 30,
    evidence: "abc",
    isValid: true,
    required: true
  }
];
