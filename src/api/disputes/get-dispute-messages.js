import apiWithAuth from '@/lib/axios-client';
import { useQuery } from '@tanstack/react-query';

export const useGetDisputeMessages = (disputeId, options = {}) => {
 return useQuery({
  queryKey: ['dispute-messages', disputeId],
  queryFn: async () => {
   try {
    const response = await apiWithAuth.get(`/staffs/dispute-messages/${disputeId}`);
    return response.data;
   } catch (error) {
    console.error('Error fetching dispute messages:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  enabled: !!disputeId,
  ...options,
 });
};

