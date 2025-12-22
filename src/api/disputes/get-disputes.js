import apiWithAuth from '@/lib/axios-client';
import { useQuery } from '@tanstack/react-query';

export const useGetAllDisputes = (params = {}, options = {}) => {
 return useQuery({
  queryKey: ['disputes', params],
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
    
    // Add status filter (pending, ongoing, resolved)
    if (params.status && params.status.trim()) {
     queryParams.append('status', params.status.trim());
    }
    
    // Add startDate parameter
    if (params.startDate && params.startDate.trim()) {
     queryParams.append('startDate', params.startDate.trim());
    }
    
    // Add endDate parameter
    if (params.endDate && params.endDate.trim()) {
     queryParams.append('endDate', params.endDate.trim());
    }
    
    // Add limit parameter if provided
    if (params.limit) {
     queryParams.append('limit', params.limit);
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/staffs/disputes?${queryString}` : '/staffs/disputes';
    
    const response = await apiWithAuth.get(url);
    return response.data;
   } catch (error) {
    console.error('Error fetching disputes:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  ...options,
 });
};

export const useGetDisputeDetails = (disputeId, options = {}) => {
 return useQuery({
  queryKey: ['dispute-details', disputeId],
  queryFn: async () => {
   try {
    const response = await apiWithAuth.get(`/staffs/disputes/${disputeId}`);
    return response.data;
   } catch (error) {
    console.error('Error fetching dispute details:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  enabled: !!disputeId,
  ...options,
 });
};

