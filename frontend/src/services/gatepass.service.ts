
import api from "./api";
import type { GatePass, CreateGatePassInput } from "../types/gatepass";

export const createGatePass = async (
  data: CreateGatePassInput
): Promise<GatePass> => {
  const response = await api.post("/gatepass", data);
  return response.data.gatePass;
};

export const getMyGatePasses = async (): Promise<GatePass[]> => {
  const response = await api.get("/gatepass/my");
  return response.data.gatePasses;
};
