import apiClient from "./apiClient";

export const getRecepcion = async (id: string) => {
  const response = await apiClient.get(`/recepcion/${id}`);
  return response.data;
};
export const getRecepcions = async () => {
  const response = await apiClient.get("/recepcion");
  return response.data;
};
export const createRecepcion = async (data: any) => {
  const response = await apiClient.post("/recepcion", data);
  return response.data;
};
export const updateRecepcion = async (id: string, data: any) => {
  const response = await apiClient.put(`/recepcion/${id}`, data);
  return response.data;
};
export const deleteRecepcion = async (id: string) => {
  const response = await apiClient.delete(`/recepcion/${id}`);
  return response.data;
};
