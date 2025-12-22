import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { cn } from '@/lib/utils';
import { ChevronRight, Menu } from 'lucide-react';

const DashboardLayout = ({ withOutlet = true, children }) => {
 const [sidebarOpen, setSidebarOpen] = useState(true);
 const location = useLocation();

 // Toggle sidebar
 const toggleSidebar = () => {
  setSidebarOpen(!sidebarOpen);
 };

 // Close sidebar on mobile when route changes
 useEffect(() => {
  const handleResize = () => {
   if (window.innerWidth < 1024) {
    setSidebarOpen(false);
   } else {
    setSidebarOpen(true);
   }
  };

  // Initial check
  handleResize();

  // Add event listener
  window.addEventListener('resize', handleResize);

  // Cleanup
  return () => {
   window.removeEventListener('resize', handleResize);
  };
 }, []);

 return (
  <div className="flex h-screen overflow-hidden bg-[#f5f5f9]">
   {/* Sidebar */}
   <DashboardSidebar
    isOpen={sidebarOpen}
    toggleSidebar={toggleSidebar}
   />

   {/* Main Content */}
   <div
    className={cn(
     'flex flex-col flex-1 w-0 overflow-hidden transition-all duration-300 ease-in-out lg:pl-[280px]',
    )}
   >
    {/* Header */}
    <div className="">
     <DashboardHeader toggleSidebar={toggleSidebar} />
    </div>

    {/* Page Content */}
    <main className="relative flex-1 overflow-y-auto focus:outline-none remove-scrollbar bg-background">
     <div className="pb-6 pt-[18px]">
      <div className=" ">
       <AnimatePresence mode="wait">
        <motion.div
         key={location.pathname}
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         exit={{ opacity: 0, x: -20 }}
         transition={{ duration: 0.2 }}
         className="h-full"
        >
         {withOutlet ? <Outlet /> : children}
        </motion.div>
       </AnimatePresence>
      </div>
     </div>
    </main>
   </div>

   {/* {!sidebarOpen && (
    <div
     onClick={toggleSidebar}
     className="fixed top-1/2 left-0 z-50 flex items-center justify-center w-6 h-24 -mt-12 bg-blue100 rounded-r-md shadow-lg cursor-pointer hover:bg-blue100/90 lg:hidden"
    >
     <ChevronRight className="size-6 text-white" />
    </div>
   )} */}
  </div>
 );
};

export default DashboardLayout;
