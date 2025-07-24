import { authorizedApi } from "../utils/api";

export const fetchProfile = async () => {
  const response = await authorizedApi().get("/me/");
  return response.data;
};

// export const getEmetteurById = async (id) => {
//   const response = await authorizedApi().get(`/emetteur/${id}`);
//   return response.data;
// };

// export const createEmetteur = async (data) => {
//   const response = await authorizedApi().post("/emetteur", data);
//   return response.data;
// };

// export const updateEmetteur = async (data) => {
//   const response = await authorizedApi().put("/emetteur", data);
//   return response.data;
// };

// export const deleteEmetteur = async (id) => {
//   const response = await authorizedApi().delete(`/emetteur/${id}`);
//   return response.data;
// };