import StatCard from '@/components/dashboard/stat-card';
import UsersTable from '@/components/user-mgt/UserMgtTable';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetUserStats } from '@/api/users/get-users';

const UserManagementPage = () => {
 const { data: statsResponse, isLoading: statsLoading } = useGetUserStats();
 const stats = statsResponse?.data || {
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  deletedUsers: 0
 };

 return (
  <div className="w-full px-4 md:px-10">
   <div className=" w-full pt-4 ">
    <div>
     <h2 className="text-[20px] text-gray900 font-extrabold leading-[140%]">
      User Management
     </h2>
     <p className="mt-1 text-sm text-gray600 leading-[140%]">
      Here is all your Kormat analytics overview
     </p>
    </div>

    {/* stats */}
    <div className="mt-4 md:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
     {statsLoading ? (
      <>
       {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white rounded-[8px] p-4 md:p-6">
         <Skeleton className="h-4 w-24 mb-2" />
         <Skeleton className="h-8 w-16" />
        </div>
       ))}
      </>
     ) : (
      <>
       <StatCard
        title="Total Users"
        value={stats.totalUsers?.toLocaleString() || "0"}
        icon={null}
       />
       <StatCard
        title="Active Users"
        value={stats.activeUsers?.toLocaleString() || "0"}
        icon={null}
       />
       <StatCard
        title="Inactive Users"
        value={stats.inactiveUsers?.toLocaleString() || "0"}
        icon={null}
       />
       <StatCard
        title="Deleted Users"
        value={stats.deletedUsers?.toLocaleString() || "0"}
        icon={null}
       />
      </>
     )}
    </div>

    {/* table */}
    <UsersTable />
   </div>
  </div>
 );
};

export default UserManagementPage;


