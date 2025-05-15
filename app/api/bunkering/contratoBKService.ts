import apiClient from "../apiClient";

export const getContratoBK = async (id: string) => {
  const response = await apiClient.get(`bunkering/contrato/${id}`);
  return response.data;
};
export const getContratosBK = async () => {
  const response = await apiClient.get("bunkering/contrato");
  return response.data;
};
export const createContratoBK = async (data: any) => {
  const response = await apiClient.post("bunkering/contrato", data);
  return response.data;
};
export const updateContratoBK = async (id: string, data: any) => {
  const response = await apiClient.put(`bunkering/contrato/${id}`, data);
  return response.data;
};
export const deleteContratoBK = async (id: string) => {
  const response = await apiClient.delete(`bunkering/contrato/${id}`);
  return response.data;
};
