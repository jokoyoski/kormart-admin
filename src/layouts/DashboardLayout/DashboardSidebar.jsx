import { NavLink, Link, useLocation } from 'react-router-dom';
import { Store } from 'lucide-react';
import { Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import LogoutConfirmation from '@/components/logout-confirmation';
import { useState, useMemo } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { IoBusinessOutline, IoCartOutline } from 'react-icons/io5';
import { RxDashboard } from 'react-icons/rx';
import { TbBriefcase } from 'react-icons/tb';
import { ChartPie, CreditCard } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { hasRouteAccess } from '@/utils/permissions';

const allMenuItems = [
 { name: 'Dashboard', header: true },
 {
  name: 'Overview',
  icon: RxDashboard,
  path: '/dashboard',
  permission: null, // Available to everyone
 },
 {
  name: 'Orders',
  icon: TbBriefcase,
  path: '/dashboard/orders',
  permission: 'manage_orders',
 },
 {
  name: 'Transactions',
  icon: CreditCard,
  path: '/dashboard/transactions',
  permission: 'manage_transactions',
 },
//  {
//   name: 'Notifications',
//   icon: TbFileText,
//   path: '/dashboard/notifications',
//  },
 {
  name: 'User Management',
  icon: IoCartOutline,
  path: '/dashboard/user-management',
  permission: 'manage_users',
 },
 { name: 'Pages', header: true },
 {
  name: 'Settings',
  icon: Store,
  path: '/dashboard/settings',
  permission: null, // Available to everyone
 },
 {
  name: 'Members Management',
  icon: IoBusinessOutline,
  path: '/dashboard/members-management',
  permission: 'manage_staffs', // Can also be accessed by manage_roles
 },
 {
  name: 'Manage Categories',
  icon: Users,
  path: '/dashboard/categories',
  permission: 'manage_categories',
 },
 {
  name: 'Disputes & Supports',
  icon: ChartPie,
  path: '/dashboard/disputes',
  hasSubmenu: true,
  badge: null,
  permission: 'all', // Requires "all" permission
 },
];

const DashboardSidebar = ({ isOpen, toggleSidebar }) => {
 const { pathname } = useLocation();
 const [openLogoutModal, setOpenLogoutModal] = useState(false);
 const { user } = useAuthStore();

 const isSmallScreen = useMediaQuery('750px');

 // Filter menu items based on user permissions
 const menuItems = useMemo(() => {
  if (!user) return [];
  
  return allMenuItems.filter((item) => {
   // Always show headers
   if (item.header) return true;
   
   // If no permission required, show it (Overview, Settings)
   if (!item.permission) return true;
   
   // Special case: Members Management can be accessed by both manage_staffs and manage_roles
   if (item.path === '/dashboard/members-management') {
    return hasRouteAccess(user, item.path);
   }
   
   // Check if user has access to this route
   return hasRouteAccess(user, item.path);
  });
 }, [user]);
 //  console.log({isSmallScreen})
 return (
  <>
   {/* Mobile sidebar backdrop */}
   <div
    className={cn(
     'fixed inset-0 z-20  bg-opacity-50 transition-opacity lg:hidden',
     isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
    )}
    onClick={toggleSidebar}
   ></div>

   {/* Sidebar */}
   <div
    className={cn(
     'fixed inset-y-0 left-0 z-30 w-[280px] bg-white sidebar-shadow transition-all duration-700 ease-in-out transform',
     isOpen
      ? 'translate-x-0'
      : '-translate-x-full lg:translate-x-0 lg:w-[60px]',
    )}
   >
    {/* Sidebar header */}
    <div className={cn('flex  relative  pt-4 pl-3')}>
     <Link
      to="/dashboard"
      className="flex items-center"
     >
      <img
       src="/logo.png"
       alt="Kormat"
       className={cn('w-[115px] h-[38px] object-contain')}
      />
     </Link>
    </div>

    {/* Sidebar content */}
    <div className="flex flex-col flex-1 overflow-y-auto">
     <nav
      className={cn(
       'flex-1   space-y-1 transition-all duration-300 pb-8',
      )}
     >
      {menuItems.map((item, index) => {
       if (item.header) {
        return (
         <div
          key={index}
          className={cn(' transition-all duration-300 ')}
         >
          <div
           //  key={index}
           className={cn(
            'px-6 mt-6 mb-2  text-[13px] leading-[140%]  text-[#939393] uppercase transition-opacity duration-300',
           )}
          >
           {item.name}
          </div>
         </div>
        );
       }
       const isDashboard = item.path === '/dashboard';
       const active = isDashboard
        ? pathname === item.path
        : pathname.startsWith(item.path);
       //  const isActive = currentActiveItem?.path === item.path;
       return (
        <div
         key={index}
         onClick={() => {
          isSmallScreen && toggleSidebar();
         }}
         className={cn(' transition-all duration-300 relative')}
        >
         <NavLink
          to={item.path}
          className={() =>
           cn(
            'group flex items-center h-[42px] px-6  font-medium  transition-all duration-300 relative',
            active
             ? 'text-gray900 bg-primary50 shadow-[3px_0px_0px_#0E5FD9]'
             : 'text-[#646464] hover:opacity-90',
           )
          }
         >
          <item.icon
           className={cn(
            'flex-shrink-0  transition-all duration-300 mr-3 size-5',
            active ? 'text-primary500' : 'text-dark-primary',
           )}
          />

          <span className=" overflow-hidden">{item.name}</span>
         </NavLink>

         {active && (
          <div className="h-full left-0 top-0 w-[3px] bg-primary500 absolute"></div>
         )}
        </div>
       );
      })}

      <div
       onClick={() => setOpenLogoutModal(true)}
       className={cn(' transition-all duration-300 relative')}
      >
       <div
        className={cn(
         'group text-dark-primary flex items-center h-[42px] px-6  font-medium  transition-all duration-300 relative',
        )}
       >
        <LogOut
         className={cn(
          'flex-shrink-0  transition-all duration-300  size-5 mr-3',
         )}
        />

        <span>Sign Out</span>
       </div>
      </div>
     </nav>
    </div>
   </div>

   <LogoutConfirmation
    open={openLogoutModal}
    onOpenChange={() => setOpenLogoutModal(!openLogoutModal)}
   />
  </>
 );
};

export default DashboardSidebar;
