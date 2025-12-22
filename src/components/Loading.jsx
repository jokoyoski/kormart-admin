import { cn } from '@/lib/utils';

export default function Loading({ message, className }) {
 return (
  <div
   className={cn('flex items-center justify-center h-[350px]', className)}
  >
   <div className="text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
    <p className="text-gray900">{message || 'Loading...'}</p>
   </div>
  </div>
 );
}
