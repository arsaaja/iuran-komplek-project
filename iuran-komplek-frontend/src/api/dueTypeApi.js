import axiosClient from './axiosClient';

export const dueTypeApi = {
  list: () => axiosClient.get('/due-types'),
  create: (data) => axiosClient.post('/due-types', data),
  update: (id, data) => axiosClient.put(`/due-types/${id}`, data),
  remove: (id) => axiosClient.delete(`/due-types/${id}`),
};
