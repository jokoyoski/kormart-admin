import apiWithAuth from '@/lib/axios-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateUserStatus = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async ({ userId, status }) => {
   const response = await apiWithAuth.patch('/staffs/update-user-status', {
    userId,
    status,
   });
   return response.data;
  },
  onSuccess: (_, variables) => {
   queryClient.invalidateQueries({
    queryKey: ['users'],
   });
   queryClient.invalidateQueries({
    queryKey: ['user-stats'],
   });
   queryClient.invalidateQueries({
    queryKey: ['user', variables.userId],
   });
   const action = variables.status === 'activate' ? 'activated' : 'deactivated';
   toast.success(`User ${action} successfully!`);
  },
  onError: (error) => {
   console.error('useUpdateUserStatus Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to update user status. Please try again.',
   );
  },
 });
};

export const useVerifyUser = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async (userId) => {
   const response = await apiWithAuth.patch(`/staffs/verify-user/${userId}`);
   return response.data;
  },
  onSuccess: (_, userId) => {
   queryClient.invalidateQueries({
    queryKey: ['users'],
   });
   queryClient.invalidateQueries({
    queryKey: ['user-stats'],
   });
   queryClient.invalidateQueries({
    queryKey: ['user', userId],
   });
   toast.success('User verified successfully!');
  },
  onError: (error) => {
   console.error('useVerifyUser Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to verify user. Please try again.',
   );
  },
 });
};

export const useUnverifyUser = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async (userId) => {
   const response = await apiWithAuth.patch(`/staffs/revoke-verification/${userId}`);
   return response.data;
  },
  onSuccess: (_, userId) => {
   queryClient.invalidateQueries({
    queryKey: ['users'],
   });
   queryClient.invalidateQueries({
    queryKey: ['user-stats'],
   });
   queryClient.invalidateQueries({
    queryKey: ['user', userId],
   });
   toast.success('User verification revoked successfully!');
  },
  onError: (error) => {
   console.error('useUnverifyUser Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to revoke user verification. Please try again.',
   );
  },
 });
};
