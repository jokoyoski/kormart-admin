import apiWithAuth from '@/lib/axios-client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

// Reset password (for logged-in users in settings)
export const useResetPassword = () => {
 return useMutation({
  mutationFn: async ({ currentPassword, newPassword, confirmPassword }) => {
   const response = await apiWithAuth.post('/staffs/reset-password', {
    currentPassword,
    newPassword,
    confirmPassword,
   });
   return response.data;
  },
  onSuccess: () => {
   toast.success('Password changed successfully');
  },
  onError: (error) => {
   console.error('useResetPassword Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to change password. Please try again.',
   );
  },
 });
};

