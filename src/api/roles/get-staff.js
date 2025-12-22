import apiWithAuth from '@/lib/axios-client';
import { useQuery } from '@tanstack/react-query';

export const useGetAllStaff = (params = {}, options = {}) => {
 return useQuery({
  queryKey: ['staff', params],
  queryFn: async () => {
   try {
    const queryParams = new URLSearchParams();
    
    // Add page parameter (convert to 1-based for backend)
    if (params.page !== undefined) {
     queryParams.append('page', params.page + 1);
    }
    
    // Add search parameter
    if (params.search && params.search.trim()) {
     queryParams.append('search', params.search.trim());
    }
    
    // Add limit parameter if provided
    if (params.limit) {
     queryParams.append('limit', params.limit);
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/staffs?${queryString}` : '/staffs';
    
    const response = await apiWithAuth.get(url);
    return response.data;
   } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  ...options,
 });
};

export const useGetAStaff = (id, options = {}) => {
 return useQuery({
  queryKey: ['staff-member', id],
  queryFn: async () => {
   try {
    const response = await apiWithAuth.get(`/staffs/${id}`);
    return response.data;
   } catch (error) {
    console.error('Error fetching staff member:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  ...options,
 });
};
