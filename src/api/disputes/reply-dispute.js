import apiWithAuth from '@/lib/axios-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useReplyDispute = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async (payload) => {
   const response = await apiWithAuth.post(
    '/staffs/reply-dispute',
    payload,
   );
   return response.data;
  },
  onSuccess: (data, variables) => {
   // Invalidate dispute details query to refetch dispute with updated messages
   queryClient.invalidateQueries({
    queryKey: ['dispute-details', variables.disputeId],
   });
   queryClient.invalidateQueries({ queryKey: ['disputes'] });
   toast.success('Reply sent successfully!');
  },
  onError: (error) => {
   console.error('useReplyDispute Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to send reply. Please try again.',
   );
  },
 });
};
export const useResolveDispute = (disputeId) => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async () => {
   const response = await apiWithAuth.post(
    `/staffs/resolve-dispute/${disputeId}`,
    {},
   );
   return response.data;
  },
  onSuccess: () => {
   // Invalidate dispute details query to refetch dispute with updated messages
   queryClient.invalidateQueries({
    queryKey: ['dispute-details', disputeId],
   });
   queryClient.invalidateQueries({ queryKey: ['disputes'] });
   toast.success('Dispute Resolved successfully!');
  },
  onError: (error) => {
   console.error('useReplyDispute Error:', error);
   toast.error(
    error?.response?.data?.detail ||
     error?.response?.data?.message ||
     'Failed to resolve dispute. Please try again.',
   );
  },
 });
};
