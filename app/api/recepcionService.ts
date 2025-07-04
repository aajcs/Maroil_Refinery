import apiClient from "./apiClient";
import axios from "axios";

export const getRecepcion = async (id: string) => {
  const response = await apiClient.get(`/recepcion/${id}`);
  return response.data;
};
export const getRecepcions = async () => {
  const response = await apiClient.get("/recepcion");
  return response.data;
};



export async function getRecepcionsFechas(params?: any) {
  const res = await axios.get("/api/recepcion/rango-fechas/", { params });
  return res.data;

}
export const createRecepcion = async (data: any) => {
  console.log(data);
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
