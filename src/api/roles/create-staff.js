import apiWithAuth from '@/lib/axios-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateStaff = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async (payload) => {
   const response = await apiWithAuth.post('/staffs/add-new-staff', payload);
   return response.data;
  },
  onSuccess: () => {
   queryClient.invalidateQueries({
    queryKey: ['staff'],
   });
   toast.success('Staff member created successfully!');
  },
  onError: (error) => {
   console.error('useCreateStaff Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to create staff member. Please try again.',
   );
  },
 });
};

export const useUpdateStaff = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async ({ staffId, payload }) => {
   const response = await apiWithAuth.put(`/staffs/add-new-staff/${staffId}`, payload);
   return response.data;
  },
  onSuccess: (data, variables) => {
   queryClient.invalidateQueries({
    queryKey: ['staff'],
   });
   queryClient.invalidateQueries({
    queryKey: ['staff-member', variables?.staffId],
   });
   toast.success('Staff member updated successfully!');
  },
  onError: (error) => {
   console.error('useUpdateStaff Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to update staff member. Please try again.',
   );
  },
 });
};

export const useDeleteStaff = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async (staffId) => {
   const response = await apiWithAuth.delete(`/staffs/${staffId}`);
   return response.data;
  },
  onSuccess: (_, staffId) => {
   queryClient.invalidateQueries({
    queryKey: ['staff'],
   });
   queryClient.invalidateQueries({
    queryKey: ['staff-member', staffId],
   });
   toast.success('Staff member deleted successfully!');
  },
  onError: (error) => {
   console.error('Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to delete staff member. Please try again.',
   );
  },
 });
};
