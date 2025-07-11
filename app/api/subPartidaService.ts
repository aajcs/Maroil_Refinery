import apiClient from "./apiClient";

export const getSubPartida = async (id: string) => {
  const response = await apiClient.get(`/subpartida/${id}`);
  return response.data;
};
export const getSubPartidas = async () => {
  const response = await apiClient.get("/subpartida");
  return response.data;
};
export const createSubPartida = async (data: any) => {
  const response = await apiClient.post("/subpartida", data);
  return response.data;
};
export const updateSubPartida = async (id: string, data: any) => {
  const response = await apiClient.put(`/subpartida/${id}`, data);
  return response.data;
};
export const deleteSubPartida = async (id: string) => {
  const response = await apiClient.delete(`/subpartida/${id}`);
  return response.data;
};
