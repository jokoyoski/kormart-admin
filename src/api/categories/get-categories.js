import apiWithAuth from '@/lib/axios-client';
import { useQuery } from '@tanstack/react-query';

export const useGetAllCategories = (params = {}, options = {}) => {
 return useQuery({
  queryKey: ['categories', params],
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
    const url = queryString ? `/categories?${queryString}` : '/categories';
    
    const response = await apiWithAuth.get(url);
    console.log({ response });
    return response.data;
   } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  ...options,
 });
};

export const useGetACategory = (id, options = {}) => {
 return useQuery({
  queryKey: ['category', id],
  queryFn: async () => {
   try {
    const response = await apiWithAuth.get(`/categories/${id}`);
    return response.data;
   } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  ...options,
 });
};
