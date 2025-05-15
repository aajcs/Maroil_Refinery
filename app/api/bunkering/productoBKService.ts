import apiClient from "../apiClient";

export const getProductoBK = async (id: string) => {
  const response = await apiClient.get(`bunkering/producto/${id}`);
  return response.data;
};
export const getProductosBK = async () => {
  const response = await apiClient.get("bunkering/producto");
  return response.data;
};
export const createProductoBK = async (data: any) => {
  const response = await apiClient.post("bunkering/producto", data);
  return response.data;
};
export const updateProductoBK = async (id: string, data: any) => {
  const response = await apiClient.put(`bunkering/producto/${id}`, data);
  return response.data;
};
export const deleteProductoBK = async (id: string) => {
  const response = await apiClient.delete(`bunkering/producto/${id}`);
  return response.data;
};
