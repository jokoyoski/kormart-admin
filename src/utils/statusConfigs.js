import {
 CheckCircle,
 XCircle,
 AlertCircle,
 Clock,
} from 'lucide-react';

/**
 * Get order status configuration
 */
export const getOrderStatusConfig = (status) => {
 switch (status) {
  case 'completed':
   return {
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success50',
    label: 'Completed',
   };
  case 'delivered':
   return {
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success50',
    label: 'Delivered',
   };
  case 'processing':
   return {
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    label: 'Processing',
   };
  case 'pending':
   return {
    icon: AlertCircle,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    label: 'Pending',
   };

  case 'cancelled':
   return {
    icon: XCircle,
    color: 'text-error',
    bg: 'bg-error50',
    label: 'Cancelled',
   };
  case 'returned':
   return {
    icon: XCircle,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    label: 'Returned',
   };
  default:
   return {
    icon: AlertCircle,
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    label: status,
   };
 }
};

/**
 * Get payment status configuration
 */
export const getPaymentStatusConfig = (status) => {
 switch (status) {
  case 'paid':
   return {
    color: 'text-success',
    bg: 'bg-success50',
    label: 'Paid',
   };
  case 'unpaid':
   return {
    color: 'text-error',
    bg: 'bg-error50',
    label: 'Unpaid',
   };
  case 'awaiting release':
   return {
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    label: 'Awaiting Release',
   };
  default:
   return {
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    label: status,
   };
 }
};

/**
 * Get transaction status configuration
 */
export const getTransactionStatusConfig = (status) => {
 switch (status) {
  case 'success':
   return {
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success50',
    label: 'Success',
   };
  case 'pending':
   return {
    icon: AlertCircle,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    label: 'Pending',
   };
  case 'failed':
   return {
    icon: XCircle,
    color: 'text-error',
    bg: 'bg-error50',
    label: 'Failed',
   };
  default:
   return {
    icon: AlertCircle,
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    label: status,
   };
 }
};
/**
 * Get dispute status configuration
 */
export const getDisputeStatusConfig = (status) => {
 // API returns 'pending', but we display it as 'new' in UI sometimes
 const displayStatus = status === 'pending' ? 'new' : status;

 switch (displayStatus) {
  case 'new':
  case 'pending':
   return {
    color: 'text-white',
    bg: 'bg-[#0F77F0]',
    label: 'New',
   };
  case 'ongoing':
   return {
    color: 'text-white',
    bg: 'bg-[#F47D5B]',
    label: 'Ongoing',
   };
  case 'resolved':
   return {
    color: 'text-white',
    bg: 'bg-[#1AD48E]',
    label: 'Resolved',
   };
  default:
   return {
    color: 'text-white',
    bg: 'bg-gray-500',
    label: status,
   };
 }
};
