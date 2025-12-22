import { apiWithoutAuth } from '@/lib/axios-client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

// Send OTP to email for password reset
export const useSendOTP = () => {
 return useMutation({
  mutationFn: async (email) => {
   const response = await apiWithoutAuth.post('/staffs/send-otp', { email });
   return response.data;
  },
  onSuccess: (data) => {
   toast.success(data?.message || 'OTP code sent successfully to your email');
  },
  onError: (error) => {
   console.error('useSendOTP Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to send OTP. Please try again.',
   );
  },
 });
};

// Validate OTP
export const useValidateOTP = () => {
 return useMutation({
  mutationFn: async ({ tempToken, otp }) => {
   const response = await apiWithoutAuth.post('/staffs/validate-otp', {
    tempToken,
    otp,
   });
   return response.data;
  },
  onSuccess: () => {
   toast.success('OTP validated successfully');
  },
  onError: (error) => {
   console.error('useValidateOTP Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Invalid OTP. Please try again.',
   );
  },
 });
};

// Change password (for reset password flow)
export const useChangePassword = () => {
 return useMutation({
  mutationFn: async ({ tempToken, newPassword, confirmPassword }) => {
   const response = await apiWithoutAuth.post('/staffs/change-password', {
    tempToken,
    newPassword,
    confirmPassword,
   });
   return response.data;
  },
  onSuccess: () => {
   toast.success('Password changed successfully');
  },
  onError: (error) => {
   console.error('useChangePassword Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to change password. Please try again.',
   );
  },
 });
};

