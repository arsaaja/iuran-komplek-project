import axiosClient from './axiosClient';

export const reportApi = {
  summary: (year) => axiosClient.get('/reports/summary', { params: { year } }),
  monthlyDetail: (month, year) =>
    axiosClient.get('/reports/monthly-detail', { params: { month, year } }),
};
