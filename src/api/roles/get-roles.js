import apiWithAuth from '@/lib/axios-client';
import { useQuery } from '@tanstack/react-query';

export const useGetAllRoles = (params = {}, options = {}) => {
 return useQuery({
  queryKey: ['roles', params],
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
    const url = queryString ? `/roles?${queryString}` : '/roles';
    
    const response = await apiWithAuth.get(url);
    return response.data;
   } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  ...options,
 });
};

export const useGetARole = (id, options = {}) => {
 return useQuery({
  queryKey: ['role', id],
  queryFn: async () => {
   try {
    const response = await apiWithAuth.get(`/roles/${id}`);
    return response.data;
   } catch (error) {
    console.error('Error fetching role:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  ...options,
 });
};

export const useGetPermissions = (options = {}) => {
 return useQuery({
  queryKey: ['permissions'],
  queryFn: async () => {
   try {
    const response = await apiWithAuth.get('/roles/permissions');
    return response.data;
   } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  ...options,
 });
};
