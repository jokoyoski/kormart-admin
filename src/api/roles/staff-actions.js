import apiWithAuth from '@/lib/axios-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useActivateStaff = () => {
 const queryClient = useQueryClient();
 return useMutation({
  mutationFn: async (staffId) => {
   const response = await apiWithAuth.patch(`/staffs/activate-staff/${staffId}`);
   return response.data;
  },
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: ['staff'] });
   toast.success('Staff member activated successfully!');
  },
  onError: (error) => {
   console.error('useActivateStaff Error:', error);
   toast.error(
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    'Failed to activate staff member. Please try again.',
   );
  },
 });
};

export const useDeactivateStaff = () => {
 const queryClient = useQueryClient();
 return useMutation({
  mutationFn: async (staffId) => {
   const response = await apiWithAuth.patch(`/staffs/deactivate-staff/${staffId}`);
   return response.data;
  },
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: ['staff'] });
   toast.success('Staff member deactivated successfully!');
  },
  onError: (error) => {
   console.error('useDeactivateStaff Error:', error);
   toast.error(
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    'Failed to deactivate staff member. Please try again.',
   );
  },
 });
};
