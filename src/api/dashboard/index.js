import apiWithAuth from '@/lib/axios-client';
import { useQuery } from '@tanstack/react-query';

export const useGetDashboardStats = (options = {}) => {
 return useQuery({
  queryKey: ['dashboard-stats'],
  queryFn: async () => {
   try {
    const response = await apiWithAuth.get(`/staffs/dashboard`);
    return response.data;
   } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  ...options,
 });
};
