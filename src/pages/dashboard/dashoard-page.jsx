import StatCard from '@/components/dashboard/stat-card';
import { SiSimpleanalytics } from 'react-icons/si';
import { FaDollarSign } from 'react-icons/fa';
import DashboardOrderTable from '@/components/dashboard/OrderTable';
import DashboardUserMgtTable from '@/components/dashboard/UserMgtTable';
import { useGetDashboardStats } from '@/api/dashboard';
import { Skeleton } from '@/components/ui/skeleton';

import { formatNumber } from '@/utils/format';

// StatCard Skeleton Component
const StatCardSkeleton = ({ hasIcon = false }) => (
 <div
  className={`flex items-center py-4 md:py-0 md:h-[97px] bg-white rounded-[8px] ${
   hasIcon ? 'px-4' : 'px-[30px]'
  }`}
 >
  {hasIcon && (
   <div className="mr-4 size-[56px] rounded-full bg-[#F4F7FE] flex items-center justify-center">
    <Skeleton className="size-6 rounded-full" />
   </div>
  )}
  <div className="flex-1">
   <Skeleton className="h-4 w-24 mb-2" />
   <Skeleton className="h-7 w-16" />
  </div>
 </div>
);

const DashboardPage = () => {
 const { data, isLoading } = useGetDashboardStats();
 // Handle both wrapped response (data.data) and direct response (data)
 const stats = data?.data || data || {};

 return (
  <div className="w-full px-4 md:px-10">
   <div className=" w-full py-4 ">
    <div>
     <h2 className="text-[20px] text-gray900 font-extrabold leading-[140%]">
      Overview
     </h2>
     <p className="mt-1 text-sm text-gray600 leading-[140%]">
      Here is all your Orders analytics overview
     </p>
    </div>

    {/* stats */}
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
     {isLoading ? (
      <>
       <StatCardSkeleton hasIcon={true} />
       <StatCardSkeleton hasIcon={true} />
       <StatCardSkeleton hasIcon={false} />
       <StatCardSkeleton hasIcon={false} />
      </>
     ) : (
      <>
       <StatCard
        title="Total Users"
        value={formatNumber(stats.totalUsers)}
        icon={SiSimpleanalytics}
       />
       <StatCard
        title="Total Products"
        value={formatNumber(stats.productCount)}
        icon={FaDollarSign}
       />
       <StatCard
        title="Total Active Users"
        value={formatNumber(stats.totalActiveUsers)}
        icon={null}
       />
       <StatCard
        title="Total Inactive Users"
        value={formatNumber(stats.totalInactiveUsers)}
        icon={null}
       />
      </>
     )}
    </div>

    {/* orders */}
    <DashboardOrderTable />

    {/* user mtg */}
    <DashboardUserMgtTable />
   </div>
  </div>
 );
};

export default DashboardPage;
