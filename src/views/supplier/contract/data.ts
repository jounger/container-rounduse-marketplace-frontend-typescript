import { IContract } from "@/entity/contract";
export const ContractData: IContract[] = [
  {
    id: 1,
    finesAgainstContractViolations: 50,
    evidence: {
      id: 1,
      sender: "merchant",
      evidence: "Oke",
      isValid: false
    },
    required: false
  },
  {
    id: 2,
    finesAgainstContractViolations: 50,
    evidence: {
      id: 1,
      sender: "merchant",
      evidence: "Oke",
      isValid: false
    },
    required: false
  }
];
