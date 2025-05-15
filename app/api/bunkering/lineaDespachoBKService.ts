import apiClient from "../apiClient";

export const getLineaDespachoBK = async (id: string) => {
  const response = await apiClient.get(`bunkering/lineaDespacho/${id}`);
  return response.data;
};
export const getLineaDespachosBK = async () => {
  const response = await apiClient.get("bunkering/lineaDespacho");
  return response.data;
};
export const createLineaDespachoBK = async (data: any) => {
  const response = await apiClient.post("bunkering/lineaDespacho", data);
  return response.data;
};
export const updateLineaDespachoBK = async (id: string, data: any) => {
  const response = await apiClient.put(`bunkering/lineaDespacho/${id}`, data);
  return response.data;
};
export const deleteLineaDespachoBK = async (id: string) => {
  const response = await apiClient.delete(`bunkering/lineaDespacho/${id}`);
  return response.data;
};
