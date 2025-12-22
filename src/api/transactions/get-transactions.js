import apiWithAuth from '@/lib/axios-client';
import { useQuery } from '@tanstack/react-query';

export const useGetAllTransactions = (params = {}, options = {}) => {
 return useQuery({
  queryKey: ['transactions', params],
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
    
    // Add transactionType filter
    if (params.transactionType && params.transactionType.trim()) {
     queryParams.append('transactionType', params.transactionType.trim());
    }
    
    // Add transactionStatus filter
    if (params.transactionStatus && params.transactionStatus.trim()) {
     queryParams.append('transactionStatus', params.transactionStatus.trim());
    }
    
    // Add limit parameter if provided
    if (params.limit) {
     queryParams.append('limit', params.limit);
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/staffs/transactions?${queryString}` : '/staffs/transactions';
    
    const response = await apiWithAuth.get(url);
    return response.data;
   } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  ...options,
 });
};

export const useGetTransactionDetails = (transactionId, options = {}) => {
 return useQuery({
  queryKey: ['transaction-details', transactionId],
  queryFn: async () => {
   try {
    const response = await apiWithAuth.get(`/staffs/transactions/${transactionId}`);
    return response.data;
   } catch (error) {
    console.error('Error fetching transaction details:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  enabled: !!transactionId,
  ...options,
 });
};
