import apiWithAuth from '@/lib/axios-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateSubCategory = (category_id) => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async (payload) => {
   const response = await apiWithAuth.post(`/sub-categories/`, {
    category: category_id,
    ...payload,
   });
   //  console.log('useCreateProduct', response);
   return response.data;
  },
  onSuccess: () => {
   queryClient.invalidateQueries({
    queryKey: ['categories'],
   });
   queryClient.invalidateQueries({
    queryKey: ['category', category_id],
   });
   //   // ["wallet-withdrawal-request", clientId]
   toast.success('Subcategory Created successfully!!!.');
  },
  onError: (error) => {
   console.error('useCreateSubCategory Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to create subcategory. Please try again.',
   );
  },
 });
};

export const useUpdateSubCategory = (category_id) => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async ({ sub_category_id, payload }) => {
   const response = await apiWithAuth.put(`/sub-categories/`, {
    subCategoryId:sub_category_id,
    category: category_id,
    ...payload,
   });
   //  console.log('useUpdateProduct', response);
   return response.data;
  },
  onSuccess: () => {
   queryClient.invalidateQueries({
    queryKey: ['categories'],
   });
   queryClient.invalidateQueries({
    queryKey: ['category', category_id],
   });
   //   // ["wallet-withdrawal-request", clientId]
   toast.success('Sub Category Updated successfully!!!.');
  },
  onError: (error) => {
   console.error('useUpdateSubCategory Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to update sub category. Please try again.',
   );
  },
 });
};

export const useDeleteSubCategory = (category_id) => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async (sub_category_id) => {
   const response = await apiWithAuth.delete(
    `/sub-categories/${sub_category_id}`,
   );
   return response.data;
  },
  onSuccess: () => {
   queryClient.invalidateQueries({
    queryKey: ['categories'],
   });
   queryClient.invalidateQueries({
    queryKey: ['category', category_id],
   });
   toast.success(`Sub Category has been deleted!.`);
  },
  onError: (error) => {
   console.error('Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to delete sub Category. Please try again.',
   );
  },
 });
};
