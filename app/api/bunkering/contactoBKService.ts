import apiClient from "../apiClient";

export const getContactoBK = async (id: string) => {
  const response = await apiClient.get(`bunkering/contacto/${id}`);
  return response.data;
};
export const getContactosBK = async () => {
  const response = await apiClient.get("bunkering/contacto");
  return response.data;
};
export const createContactoBK = async (data: any) => {
  const response = await apiClient.post("bunkering/contacto", data);
  return response.data;
};
export const updateContactoBK = async (id: string, data: any) => {
  const response = await apiClient.put(`bunkering/contacto/${id}`, data);
  return response.data;
};
export const deleteContactoBK = async (id: string) => {
  const response = await apiClient.delete(`bunkering/contacto/${id}`);
  return response.data;
};
