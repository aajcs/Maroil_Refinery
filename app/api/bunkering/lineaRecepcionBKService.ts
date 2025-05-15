import apiClient from "../apiClient";

export const getLineaRecepcionBK = async (id: string) => {
  const response = await apiClient.get(`bunkering/lineaCarga/${id}`);
  return response.data;
};
export const getLineaRecepcionsBK = async () => {
  const response = await apiClient.get("bunkering/lineaCarga");
  return response.data;
};
export const createLineaRecepcionBK = async (data: any) => {
  const response = await apiClient.post("bunkering/lineaCarga", data);
  return response.data;
};
export const updateLineaRecepcionBK = async (id: string, data: any) => {
  const response = await apiClient.put(`bunkering/lineaCarga/${id}`, data);
  return response.data;
};
export const deleteLineaRecepcionBK = async (id: string) => {
  const response = await apiClient.delete(`bunkering/lineaCarga/${id}`);
  return response.data;
};
