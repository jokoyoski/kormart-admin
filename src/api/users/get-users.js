import apiWithAuth from '@/lib/axios-client';
import { useQuery } from '@tanstack/react-query';

export const useGetUserStats = (options = {}) => {
 return useQuery({
  queryKey: ['user-stats'],
  queryFn: async () => {
   try {
    const response = await apiWithAuth.get('/staffs/user-report');
    return response.data;
   } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  ...options,
 });
};

export const useGetAllUsers = (params = {}, options = {}) => {
 return useQuery({
  queryKey: ['users', params],
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
    const url = queryString ? `/staffs/users?${queryString}` : '/staffs/users';
    
    const response = await apiWithAuth.get(url);
    return response.data;
   } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  ...options,
 });
};

export const useGetAUser = (id, options = {}) => {
 return useQuery({
  queryKey: ['user', id],
  queryFn: async () => {
   try {
    const response = await apiWithAuth.get(`/staffs/users/${id}`);
    return response.data;
   } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  ...options,
 });
};
