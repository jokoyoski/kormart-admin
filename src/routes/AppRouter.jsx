import { lazy, Suspense } from 'react';
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
import Loading from '@/components/Loading';
import { Navigate } from 'react-router-dom';
import DashboardPage from '@/pages/dashboard/dashoard-page';


const OrdersPage = lazy(() => import('@/pages/dashboard/OrdersPage'));
const NotificationsPage = lazy(
 () => import('@/pages/dashboard/notifications-page'),
);
const CreateNotificationsPage = lazy(
 () => import('@/pages/dashboard/create-notifications'),
);
const UserManagementPage = lazy(
 () => import('@/pages/dashboard/user-management'),
);
const UserDetailsPage = lazy(
 () => import('@/pages/dashboard/user-details'),
);
const CategoriesPage = lazy(
 () => import('@/pages/dashboard/categories-page'),
);
const DisputesPage = lazy(
 () => import('@/pages/dashboard/DisputesPage'),
);
const DisputeDetailsPage = lazy(
 () => import('@/pages/dashboard/DisputeDetailsPage'),
);
const CategoryDetailsPage = lazy(
 () => import('@/pages/dashboard/category-details'),
);
const RolesPermissionsPage = lazy(
 () => import('@/pages/dashboard/roles-permissions'),
);
const TransactionsPage = lazy(
 () => import('@/pages/dashboard/transactions-page'),
);
const TransactionDetailsPage = lazy(
 () => import('@/pages/dashboard/transaction-details'),
);
const OrderDetailsPage = lazy(
 () => import('@/pages/dashboard/order-details'),
);
const SettingsPage = lazy(
 () => import('@/pages/dashboard/SettingsPage.jsx'),
);

// Component to check auth and redirect
const AuthRedirect = ({ children }) => {
 const { isAuthenticated } = useAuthStore();
 if (isAuthenticated) {
  return <Navigate to="/dashboard" replace />;
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
       element: (
        <Suspense fallback={<Loading />}>
         <DashboardPage />
        </Suspense>
       ),
      },
      {
       path: '/dashboard/orders',
       element: (
        <ProtectedRoute>
         <Suspense fallback={<Loading />}>
          <OrdersPage />
         </Suspense>
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/orders/:id',
       element: (
        <ProtectedRoute>
         <Suspense fallback={<Loading />}>
          <OrderDetailsPage />
         </Suspense>
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/transactions',
       element: (
        <ProtectedRoute>
         <Suspense fallback={<Loading />}>
          <TransactionsPage />
         </Suspense>
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/transactions/:id',
       element: (
        <ProtectedRoute>
         <Suspense fallback={<Loading />}>
          <TransactionDetailsPage />
         </Suspense>
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/notifications',
       element: (
        <ProtectedRoute>
         <Suspense fallback={<Loading />}>
          <NotificationsPage />
         </Suspense>
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/create-notification',
       element: (
        <ProtectedRoute>
         <Suspense fallback={<Loading />}>
          <CreateNotificationsPage />
         </Suspense>
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/user-management',
       element: (
        <ProtectedRoute>
         <Suspense fallback={<Loading />}>
          <UserManagementPage />
         </Suspense>
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/user-management/:id',
       element: (
        <ProtectedRoute>
         <Suspense fallback={<Loading />}>
          <UserDetailsPage />
         </Suspense>
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/categories',
       element: (
        <ProtectedRoute>
         <Suspense fallback={<Loading />}>
          <CategoriesPage />
         </Suspense>
        </ProtectedRoute>
       ),
      },
      {
       path: 'category/:id',
       element: (
        <ProtectedRoute>
         <Suspense fallback={<Loading />}>
          <CategoryDetailsPage />
         </Suspense>
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/disputes',
       element: (
        <ProtectedRoute>
         <Suspense fallback={<Loading />}>
          <DisputesPage />
         </Suspense>
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/disputes/:id',
       element: (
        <ProtectedRoute>
         <Suspense fallback={<Loading />}>
          <DisputeDetailsPage />
         </Suspense>
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/members-management',
       element: (
        <ProtectedRoute>
         <Suspense fallback={<Loading />}>
          <RolesPermissionsPage />
         </Suspense>
        </ProtectedRoute>
       ),
      },
      {
       path: '/dashboard/settings',
       element: (
        <Suspense fallback={<Loading />}>
         <SettingsPage />
        </Suspense>
       ),
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
