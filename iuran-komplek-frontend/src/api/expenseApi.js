import axiosClient from './axiosClient';

export const expenseApi = {
  list: (params) => axiosClient.get('/expenses', { params }),
  create: (data) => axiosClient.post('/expenses', data),
  update: (id, data) => axiosClient.put(`/expenses/${id}`, data),
  remove: (id) => axiosClient.delete(`/expenses/${id}`),
};
