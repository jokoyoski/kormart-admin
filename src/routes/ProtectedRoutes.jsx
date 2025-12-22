import useAuthStore from '@/store/authStore';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
 const { isAuthenticated, user } = useAuthStore();

 if (user && isAuthenticated) return <Outlet />;
 else return <Navigate to="/login" />;
};

export default ProtectedRoutes;
