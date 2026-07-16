import axiosClient from './axiosClient';

export const authApi = {
  login: (email, password) => axiosClient.post('/login', { email, password }),
  logout: () => axiosClient.post('/logout'),
  me: () => axiosClient.get('/me'),
};
