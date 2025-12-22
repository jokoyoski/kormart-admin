import { Search, Bell, Menu } from 'lucide-react';

import useAuthStore from '@/store/authStore';
import { PiCaretDownBold } from 'react-icons/pi';
import { LuLayoutGrid } from 'react-icons/lu';

const DashboardHeader = ({ toggleSidebar }) => {
 const { user } = useAuthStore();

 const notifications = null;

 return (
  <header className="sticky top-0 z-10 flex items-center py-4 px-4 md:px-10 bg-white  sm:px-10 sidebar-[1px_0px_0px_0px_#F2F3F4] ">
   <div className="flex items-center justify-between   w-full">
    <button
     onClick={toggleSidebar}
     className="p-1 mr-2 text-text-primary bg-gray-50 rounded-full hover:text-gray-600 hover:bg-gray-200 focus:outline-none  lg:hidden"
    >
     <Menu className="w-5 h-5" />
    </button>

    {/* Left section */}
    <div className="flex items-center flex-1">
     <div className="relative w-full max-w-[240px] h-10 bg-[#F2F3F4B2] rounded-[4px] overflow-y-hidden">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
       <Search className="w-5 h-5 text-black" />
      </div>
      <input
       type="text"
       className=" w-full h-full flex items-center pl-[44px] font-urbanist  text-sm bg-transparent border-0  placeholder:text-[#939393] text-[#32475CDE] outline-none"
       placeholder="Search"
      />
     </div>
    </div>

    {/* Right section */}
    <div className="flex items-center space-x-4">
     {/* language selector */}
     <div className="h-8 w-[110px] rounded-[4px] bg-gray50 px-2  flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 text-gray700 text-sm">
       <img
        src="/assets/us.png"
        alt="us flag"
        className="size-4 object-contain"
       />
       <span className="hidden md:inline">English</span>
      </div>
      <PiCaretDownBold className="text-[#7B878C] size-4" />
     </div>

     {/* layour */}
     <LuLayoutGrid className="size-4 text-gray700" />

     {/* Notifications */}

     {/* <button className="relative p-1 text-gray700  rounded-full hover:text-gray-600 focus:outline-none ">
      <Bell className="size-4" />
      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
     </button> */}
    </div>
   </div>
  </header>
 );
};

export default DashboardHeader;
