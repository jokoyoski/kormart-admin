import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format currency with NGN currency and proper parsing
 * Handles null/undefined values and defaults to 0
 */
export const formatDetailCurrency = (amount) => {
 return new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
 }).format(parseFloat(amount || 0));
};

/**
 * Format date with detailed format including time
 * Uses en-NG locale with long month names
 */
export const formatDetailDate = (dateString) => {
 if (!dateString) return 'N/A';
 return new Date(dateString).toLocaleString('en-NG', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
 });
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
 if (num === null || num === undefined) return '0';
 return num.toLocaleString();
};

/**
 * Format currency (Standard)
 */
export const formatCurrency = (amount) => {
 if (!amount) return 'N/A';
 try {
  return new Intl.NumberFormat('en-NG', {
   style: 'currency',
   currency: 'NGN',
  }).format(parseFloat(amount));
 } catch {
  return amount;
 }
};

/**
 * Format date using date-fns
 */
export const formatDate = (dateString) => {
 if (!dateString) return 'N/A';
 try {
  return format(new Date(dateString), 'MMM d, yyyy h:mm a');
 } catch {
  return 'N/A';
 }
};

/**
 * Format relative time using date-fns
 */
export const formatRelativeTime = (dateString) => {
 if (!dateString) return 'N/A';
 try {
  return formatDistanceToNow(new Date(dateString), {
   addSuffix: true,
  });
 } catch {
  return 'N/A';
 }
};
