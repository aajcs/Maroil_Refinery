import apiClient from "../apiClient";

export const getChequeoCantidadBK = async (id: string) => {
  const response = await apiClient.get(`bunkering/chequeoCantidad/${id}`);
  return response.data;
};
export const getChequeoCantidadsBK = async () => {
  const response = await apiClient.get("bunkering/chequeoCantidad");
  return response.data;
};
export const createChequeoCantidadBK = async (data: any) => {
  const response = await apiClient.post("bunkering/chequeoCantidad", data);
  return response.data;
};
export const updateChequeoCantidadBK = async (id: string, data: any) => {
  const response = await apiClient.put(`bunkering/chequeoCantidad/${id}`, data);
  return response.data;
};
export const deleteChequeoCantidadBK = async (id: string) => {
  const response = await apiClient.delete(`bunkering/chequeoCantidad/${id}`);
  return response.data;
};
