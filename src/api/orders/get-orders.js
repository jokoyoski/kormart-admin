import apiWithAuth from '@/lib/axios-client';
import { useQuery } from '@tanstack/react-query';

export const useGetAllOrders = (params = {}, options = {}) => {
 return useQuery({
  queryKey: ['orders', params],
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
    
    // Add orderStatus filter
    if (params.orderStatus && params.orderStatus.trim()) {
     queryParams.append('orderStatus', params.orderStatus.trim());
    }
    
    // Add sortBy parameter
    if (params.sortBy && params.sortBy.trim()) {
     queryParams.append('sortBy', params.sortBy.trim());
    }
    
    // Add sortOrder parameter
    if (params.sortOrder && params.sortOrder.trim()) {
     queryParams.append('sortOrder', params.sortOrder.trim());
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
    const url = queryString ? `/staffs/orders?${queryString}` : '/staffs/orders';
    
    const response = await apiWithAuth.get(url);
    return response.data;
   } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  ...options,
 });
};

export const useGetOrderDetails = (orderId, options = {}) => {
 return useQuery({
  queryKey: ['order-details', orderId],
  queryFn: async () => {
   try {
    const response = await apiWithAuth.get(`/staffs/orders/${orderId}`);
    return response.data;
   } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  enabled: !!orderId,
  ...options,
 });
};
