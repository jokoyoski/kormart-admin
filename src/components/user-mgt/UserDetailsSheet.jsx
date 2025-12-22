import {
 Sheet,
 SheetContent,
 SheetHeader,
 SheetTitle,
} from '@/components/ui/sheet';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function UserDetailsSheet({ open, onOpenChange, user }) {
 if (!user) return null;

 const DetailRow = ({ label, value, isBoolean = false }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
   <span className="text-sm text-gray-600 font-medium">{label}</span>
   {isBoolean ? (
    <span
     className={cn(
      'px-3 py-1 rounded-full text-xs font-medium',
      value
       ? 'bg-green-100 text-green-700'
       : 'bg-red-100 text-red-700',
     )}
    >
     {value ? 'Yes' : 'No'}
    </span>
   ) : (
    <span className="text-sm text-gray-900 font-medium text-right max-w-[60%] break-words">
     {value}
    </span>
   )}
  </div>
 );

 return (
  <Sheet
   open={open}
   onOpenChange={onOpenChange}
  >
   <SheetContent className="w-full sm:max-w-md overflow-y-auto !border-0 bg-white">
    <SheetHeader>
     <SheetTitle>User Details</SheetTitle>
    </SheetHeader>

    <div className="mt-6 space-y-1">
     <DetailRow
      label="User ID"
      value={user?.id}
     />
     <DetailRow
      label="Full Name"
      value={user?.userDetails?.fullName ?? 'NA'}
     />
     <DetailRow
      label="Username"
      value={user?.userDetails?.username ?? 'NA'}
     />
     <DetailRow
      label="Email"
      value={user?.email}
     />
     <DetailRow
      label="Phone Number"
      value={user?.userDetails?.telephone ?? 'NA'}
     />
     <DetailRow
      label="Active"
      value={user?.isActive}
      isBoolean
     />
     <DetailRow
      label="Verified"
      value={user?.isVerified}
      isBoolean
     />
     <DetailRow
      label="Wallet Activated"
      value={user?.isWalletActivated}
      isBoolean
     />
     <DetailRow
      label="Suspended"
      value={user?.isSuspended}
      isBoolean
     />
     <DetailRow
      label="Profile Completed"
      value={user?.hasCompletedProfile}
      isBoolean
     />
     <DetailRow
      label="Registered On"
      value={format(new Date(user?.createdAt), 'MMM d, yyyy h:mm a')}
     />
    </div>
   </SheetContent>
  </Sheet>
 );
}
