import axiosClient from './axiosClient';

export const paymentApi = {
  list: (params) => axiosClient.get('/payments', { params }),
  get: (id) => axiosClient.get(`/payments/${id}`),
  create: (data) => axiosClient.post('/payments', data),
};
