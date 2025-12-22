import { apiWithoutAuth } from '@/lib/axios-client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useLoginMutation = () => {
 return useMutation({
  mutationFn: async (data) => {
   const response = await apiWithoutAuth.post(`/authentication/login/`, data);
   //  console.log('response', response);
   return response.data?.data;
  },
  onSuccess: () => {},
  onError: (error) => {
   console.error('Error:', error);
   toast.error(
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
     'Failed to login. Please try again.',
   );
  },
 });
};
