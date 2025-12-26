import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import { hasRouteAccess } from '@/utils/permissions';

/**
 * ProtectedRoute component that checks permissions before allowing access
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {String} props.requiredPermission - Optional specific permission required
 */
const ProtectedRoute = ({ children, requiredPermission = null }) => {
 const location = useLocation();
 const { user, isAuthenticated, accessToken, logout } =
  useAuthStore();

 // Check if all required auth data exists
 const isFullyAuthenticated = isAuthenticated && user && accessToken;

 // Redirect to login if not fully authenticated
 if (!isFullyAuthenticated) {
  // Clear any inconsistent auth state before redirecting
  logout();
  return (
   <Navigate
    to="/login"
    replace
   />
  );
 }

 // Check if user has access to this route
 const hasAccess = requiredPermission
  ? hasRouteAccess(user, location.pathname)
  : hasRouteAccess(user, location.pathname);

 if (!hasAccess) {
  // Show error message
  toast.error('You do not have permission to access this page.');
  // Redirect to dashboard
  return (
   <Navigate
    to="/dashboard"
    replace
   />
  );
 }

 return children;
};

export default ProtectedRoute;
