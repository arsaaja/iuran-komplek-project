import axiosClient from "./axiosClient";

export const residentApi = {
  list: (params) => axiosClient.get("/residents", { params }),
  get: (id) => axiosClient.get(`/residents/${id}`),
  create: (formData) =>
    axiosClient.post("/residents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    axiosClient.post(`/residents/${id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
