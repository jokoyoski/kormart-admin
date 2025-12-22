import apiWithAuth from '@/lib/axios-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Fetch service charges
export const useGetServiceCharges = (options = {}) => {
 return useQuery({
  queryKey: ['service-charges'],
  queryFn: async () => {
   try {
    const response = await apiWithAuth.get('/staffs/service-charges');
    return response.data;
   } catch (error) {
    console.error('Error fetching service charges:', error);
    throw error;
   }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  ...options,
 });
};

// Update service charge
export const useUpdateServiceCharge = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async (payload) => {
   const response = await apiWithAuth.post('/staffs/update-service-charge', payload);
   return response.data;
  },
  onSuccess: () => {
   queryClient.invalidateQueries({
    queryKey: ['service-charges'],
   });
   toast.success('Service charge updated successfully!');
  },
  onError: (error) => {
   console.error('useUpdateServiceCharge Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to update service charge. Please try again.',
   );
  },
 });
};

