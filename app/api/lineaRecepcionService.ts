import apiClient from "./apiClient";

export const getLineaRecepcion = async (id: string) => {
  const response = await apiClient.get(`/linea_carga/${id}`);
  return response.data;
};
export const getLineaRecepcions = async () => {
  const response = await apiClient.get("/linea_carga");
  return response.data;
};
export const createLineaRecepcion = async (data: any) => {
  const response = await apiClient.post("/linea_carga", data);
  return response.data;
};
export const updateLineaRecepcion = async (id: string, data: any) => {
  const response = await apiClient.put(`/linea_carga/${id}`, data);
  return response.data;
};
export const deleteLineaRecepcion = async (id: string) => {
  const response = await apiClient.delete(`/linea_carga/${id}`);
  return response.data;
};
