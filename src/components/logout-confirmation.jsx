import { useState } from 'react';
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogDescription,
 DialogFooter,
} from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';

const LogoutConfirmation = ({ open, onOpenChange }) => {
 const navigate = useNavigate();
 const [isLoggingOut, setIsLoggingOut] = useState(false);
 const { logout } = useAuthStore();

 const handleLogout = async () => {
  setIsLoggingOut(true);
  try {
   logout();
   toast.success('Logged out successfully');

   // Navigate to login page
   navigate('/login');
  } catch (error) {
   toast.error('Failed to logout. Please try again.');
   console.error('Logout error:', error);
   setIsLoggingOut(false);
  }
 };

 return (
  <Dialog
   open={open}
   onOpenChange={onOpenChange}
  >
   <DialogContent className="sm:max-w-md">
    <DialogHeader>
     <DialogTitle>Confirm Logout</DialogTitle>
     <DialogDescription>
      Are you sure you want to log out of your account?
     </DialogDescription>
    </DialogHeader>

    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
     <Button
      variant="destructive"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="bg-red-600 text-white hover:bg-red-700"
     >
      {isLoggingOut ? 'Logging out...' : 'Yes, logout'}
     </Button>
     <Button
      variant="outline"
      onClick={() => onOpenChange(false)}
     >
      Cancel
     </Button>
    </DialogFooter>
   </DialogContent>
  </Dialog>
 );
};

export default LogoutConfirmation;
