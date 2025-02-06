import apiClient from "./apiClient";

export const getTorreDestilacion = async (id: string) => {
  const response = await apiClient.get(`/torre/${id}`);
  return response.data;
};
export const getTorresDestilacion = async () => {
  const response = await apiClient.get("/torre");
  return response.data;
};
export const createTorreDestilacion = async (data: any) => {
  const response = await apiClient.post("/torre", data);
  return response.data;
};
export const updateTorreDestilacion = async (id: string, data: any) => {
  console.log(data);
  const response = await apiClient.put(`/torre/${id}`, data);
  console.log(response.data);
  return response.data;
};
export const deleteTorreDestilacion = async (id: string) => {
  const response = await apiClient.delete(`/torre/${id}`);
  return response.data;
};
