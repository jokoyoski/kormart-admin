import apiWithAuth from '@/lib/axios-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateCategory = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async (payload) => {
   const response = await apiWithAuth.post(`/categories/`, payload);
   //  console.log('useCreateProduct', response);
   return response.data;
  },
  onSuccess: () => {
   queryClient.invalidateQueries({
    queryKey: ['categories'],
   });
   //   // ["wallet-withdrawal-request", clientId]
   toast.success('Category Created successfully!!!.');
  },
  onError: (error) => {
   console.error('useCreateCategory Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to create category. Please try again.',
   );
  },
 });
};

export const useUpdateCategory = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async ({ category_id, payload }) => {
   const response = await apiWithAuth.put(`/categories/`, {
    categoryId: category_id,
    ...payload,
   });
   //  console.log('useUpdateProduct', response);
   return response.data;
  },
  onSuccess: (data, variables) => {
   //    console.log('data,', data);
   //    console.log('variables', variables);
   queryClient.invalidateQueries({
    queryKey: ['categories'],
   });
   queryClient.invalidateQueries({
    queryKey: ['category', variables?.category_id],
   });
   //   // ["wallet-withdrawal-request", clientId]
   toast.success('Category Updated successfully!!!.');
  },
  onError: (error) => {
   console.error('useUpdateCategory Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to update category. Please try again.',
   );
  },
 });
};

export const useDeleteCategory = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async (category_id) => {
   const response = await apiWithAuth.delete(
    `/categories/${category_id}`,
   );
   return response.data;
  },
  onSuccess: (_, category_id) => {
   queryClient.invalidateQueries({
    queryKey: ['categories'],
   });
   queryClient.invalidateQueries({
    queryKey: ['category', category_id],
   });
   toast.success(`Category has been deleted!.`);
  },
  onError: (error) => {
   console.error('Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to delete Category. Please try again.',
   );
  },
 });
};
