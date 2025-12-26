import AuthLayout from '@/layouts/AuthLayout/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout';
import {
 createBrowserRouter,
 RouterProvider,
} from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import ErrorElement from './ErrorElement/ErrorElement';
import LoginPage from '@/pages/auth/login';
import ForgotPasswordPage from '@/pages/auth/forgot-password';
import ResetPasswordPage from '@/pages/auth/reset-password';
import OTPVerificationPage from '@/pages/auth/otp-verification';
import useAuthStore from '@/store/authStore';
import { Navigate } from 'react-router-dom';
import DashboardPage from '@/pages/dashboard/dashoard-page';
import OrdersPage from '@/pages/dashboard/OrdersPage';
import NotificationsPage from '@/pages/dashboard/notifications-page';
import CreateNotificationsPage from '@/pages/dashboard/create-notifications';
import UserManagementPage from '@/pages/dashboard/user-management';
import UserDetailsPage from '@/pages/dashboard/user-details';
import CategoriesPage from '@/pages/dashboard/categories-page';
import DisputesPage from '@/pages/dashboard/DisputesPage';
import DisputeDetailsPage from '@/pages/dashboard/DisputeDetailsPage';
import CategoryDetailsPage from '@/pages/dashboard/category-details';
import RolesPermissionsPage from '@/pages/dashboard/roles-permissions';
import TransactionsPage from '@/pages/dashboard/transactions-page';
import TransactionDetailsPage from '@/pages/dashboard/transaction-details';
import OrderDetailsPage from '@/pages/dashboard/order-details';
import SettingsPage from '@/pages/dashboard/SettingsPage.jsx';

// Component to check auth and redirect
const AuthRedirect = ({ children }) => {
 const { isAuthenticated, user, accessToken, logout } =
  useAuthStore();

 // If isAuthenticated is true but user or token is missing, clear the inconsistent state
 if (isAuthenticated && (!user || !accessToken)) {
  logout();
  return children;
 }

 // Only redirect to dashboard if all auth data exists
 if (isAuthenticated && user && accessToken) {
  return (
   <Navigate
    to="/dashboard"
    replace
   />
  );
 }

 return children;
};

const AppRouter = () => {
 const { isAuthenticated } = useAuthStore();

 // Use different layout to display error depending on authentication status
 const ErrorDisplay = () => {
  return isAuthenticated ? (
   <DashboardLayout withOutlet={false}>
    <ErrorElement />
   </DashboardLayout>
  ) : (
   <AuthLayout withOutlet={false}>
    <ErrorElement />
   </AuthLayout>
  );
 };

 const router = createBrowserRouter([
  {
   element: <AuthLayout />,
   children: [
    {
     path: '/',
     element: (
      <AuthRedirect>
       <LoginPage />
      </AuthRedirect>
     ),
    },
   ],
   errorElement: <AuthLayout />,
  },
  {
   element: <AuthLayout />,
   children: [
    {
     path: '/login',
     element: (
      <AuthRedirect>
       <LoginPage />
      </AuthRedirect>
     ),
    },
    {
     path: '/forgot-password',
     element: (
      <AuthRedirect>
       <ForgotPasswordPage />
      </AuthRedirect>
     ),
    },
    {
     path: '/otp-verification',
     element: (
      <AuthRedirect>
       <OTPVerificationPage />
      </AuthRedirect>
     ),
    },
    {
     path: '/reset-password',
     element: (
      <AuthRedirect>
       <ResetPasswordPage />
      </AuthRedirect>
     ),
    },
   ],
   errorElement: <ErrorDisplay />,
  },
  {
   element: <ProtectedRoutes />,
   children: [
    {
     path: '/dashboard/',
     element: <DashboardLayout />,
     children: [
      {
       index: true,
       element: <DashboardPage />,
      },
      {
       path: '/dashboard/orders',
       element: (
        <ProtectedRoute>
         <OrdersPage />
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/orders/:id',
       element: (
        <ProtectedRoute>
         <OrderDetailsPage />
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/transactions',
       element: (
        <ProtectedRoute>
         <TransactionsPage />
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/transactions/:id',
       element: (
        <ProtectedRoute>
         <TransactionDetailsPage />
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/notifications',
       element: (
        <ProtectedRoute>
         <NotificationsPage />
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/create-notification',
       element: (
        <ProtectedRoute>
         <CreateNotificationsPage />
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/user-management',
       element: (
        <ProtectedRoute>
         <UserManagementPage />
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/user-management/:id',
       element: (
        <ProtectedRoute>
         <UserDetailsPage />
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/categories',
       element: (
        <ProtectedRoute>
         <CategoriesPage />
        </ProtectedRoute>
       ),
      },
      {
       path: 'category/:id',
       element: (
        <ProtectedRoute>
         <CategoryDetailsPage />
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/disputes',
       element: (
        <ProtectedRoute>
         <DisputesPage />
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/disputes/:id',
       element: (
        <ProtectedRoute>
         <DisputeDetailsPage />
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/members-management',
       element: (
        <ProtectedRoute>
         <RolesPermissionsPage />
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/settings',
       element: <SettingsPage />,
      },
     ],
     errorElement: <ErrorDisplay />,
    },
   ],
   errorElement: <ErrorDisplay />,
  },
 ]);

 return <RouterProvider router={router} />;
};

export default AppRouter;
