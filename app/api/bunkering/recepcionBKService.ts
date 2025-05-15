import apiClient from "../apiClient";

export const getRecepcionBK = async (id: string) => {
  const response = await apiClient.get(`bunkering/recepcion/${id}`);
  return response.data;
};
export const getRecepcionsBK = async () => {
  const response = await apiClient.get("bunkering/recepcion");
  return response.data;
};
export const createRecepcionBK = async (data: any) => {
  const response = await apiClient.post("bunkering/recepcion", data);
  return response.data;
};
export const updateRecepcionBK = async (id: string, data: any) => {
  const response = await apiClient.put(`bunkering/recepcion/${id}`, data);
  return response.data;
};
export const deleteRecepcionBK = async (id: string) => {
  const response = await apiClient.delete(`bunkering/recepcion/${id}`);
  return response.data;
};
