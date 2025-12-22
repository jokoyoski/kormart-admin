import apiWithAuth from '@/lib/axios-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateRole = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async (payload) => {
   const response = await apiWithAuth.post('/roles', payload);
   return response.data;
  },
  onSuccess: () => {
   queryClient.invalidateQueries({
    queryKey: ['roles'],
   });
   toast.success('Role created successfully!');
  },
  onError: (error) => {
   console.error('useCreateRole Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to create role. Please try again.',
   );
  },
 });
};

export const useUpdateRole = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async ({ roleId, payload }) => {
   const response = await apiWithAuth.put(`/roles`, {
    roleId,
    ...payload,
   });
   return response.data;
  },
  onSuccess: (data, variables) => {
   queryClient.invalidateQueries({
    queryKey: ['roles'],
   });
   queryClient.invalidateQueries({
    queryKey: ['role', variables?.roleId],
   });
   toast.success('Role updated successfully!');
  },
  onError: (error) => {
   console.error('useUpdateRole Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to update role. Please try again.',
   );
  },
 });
};

export const useDeleteRole = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async (roleId) => {
   const response = await apiWithAuth.delete(`/roles/${roleId}`);
   return response.data;
  },
  onSuccess: (_, roleId) => {
   queryClient.invalidateQueries({
    queryKey: ['roles'],
   });
   queryClient.invalidateQueries({
    queryKey: ['role', roleId],
   });
   toast.success('Role deleted successfully!');
  },
  onError: (error) => {
   console.error('Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to delete role. Please try again.',
   );
  },
 });
};
