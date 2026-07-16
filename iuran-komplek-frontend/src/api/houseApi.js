import axiosClient from './axiosClient';

export const houseApi = {
  list: (params) => axiosClient.get('/houses', { params }),
  get: (id) => axiosClient.get(`/houses/${id}`),
  create: (data) => axiosClient.post('/houses', data),
  update: (id, data) => axiosClient.put(`/houses/${id}`, data),
  remove: (id) => axiosClient.delete(`/houses/${id}`),
  histories: (id) => axiosClient.get(`/houses/${id}/histories`),
};
