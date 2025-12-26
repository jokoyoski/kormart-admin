import useAuthStore from '@/store/authStore';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
 const { isAuthenticated, user, accessToken, logout } =
  useAuthStore();

 // Check if all required auth data exists
 const isFullyAuthenticated = isAuthenticated && user && accessToken;

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

 return <Outlet />;
};

export default ProtectedRoutes;
