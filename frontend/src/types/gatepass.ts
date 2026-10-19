
export type GatePassStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Active"
  | "Returned"
  | "Expired";

export interface GatePass {
  _id: string;
  reason: string;
  destination: string;
  outDate: string;
  expectedReturn: string;
  emergencyContact?: string;
  emergencyContanct?: string;
  status: GatePassStatus;
  qrToken?: string;
  rejectionReason?: string;
  exitTime?: string;
  entryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGatePassInput {
  reason: string;
  destination: string;
  outDate: string;
  expectedReturn: string;
  emergencyContact: string;
}
