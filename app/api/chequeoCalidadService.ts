import apiClient from "./apiClient";

export const getChequeoCalidad = async (id: string) => {
  const response = await apiClient.get(`/chequeoCalidad/${id}`);
  return response.data;
};
export const getChequeoCalidads = async () => {
  const response = await apiClient.get("/chequeoCalidad");
  return response.data;
};
export const createChequeoCalidad = async (data: any) => {
  console.log("data", data);

  const response = await apiClient.post("/chequeoCalidad", data);
  return response.data;
};
export const updateChequeoCalidad = async (id: string, data: any) => {
  const response = await apiClient.put(`/chequeoCalidad/${id}`, data);
  return response.data;
};
export const deleteChequeoCalidad = async (id: string) => {
  const response = await apiClient.delete(`/chequeoCalidad/${id}`);
  return response.data;
};
