import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { PiDownloadSimple } from 'react-icons/pi';
import { Card } from '../ui/card';
import DataTable from '../ui/data-table';
import { useGetAllUsers } from '@/api/users/get-users';
import { Skeleton } from '../ui/skeleton';

const DashboardUserMgtTable = () => {
 const navigate = useNavigate();

 // Fetch recent users (limit 10, no pagination)
 const { data: usersResponse, isLoading } = useGetAllUsers({
  limit: 10
 });
 
 const users = usersResponse?.data || [];

 // Table columns for users
 const usersColumns = [
  {
   header: 'NO',
   accessor: 'index',
   enableSorting: false,
   cell: (info) => {
    return <span>{info.row.index + 1}</span>;
   },
  },

  {
   header: 'Full Name',
   accessor: 'fullName',
   enableSorting: false,
   cell: (info) => {
    const user = info.row.original;
    const name = user?.userDetails?.fullName || 'N/A';
    return <span className="block min-w-[150px]">{name}</span>;
   },
  },
  {
   header: 'Username',
   accessor: 'username',
   enableSorting: false,
   cell: (info) => {
    const user = info.row.original;
    const username = user?.userDetails?.username || 'N/A';
    return <span>{username}</span>;
   },
  },

  {
   header: 'Email Address',
   accessor: 'email',
   enableSorting: false,
   cell: (info) => {
    const value = info.getValue();
    return <span>{value}</span>;
   },
  },

  {
   header: 'Status',
   accessor: 'isActive',
   enableSorting: false,
   cell: (info) => {
    const user = info.row.original;
    const isActive = user.isActive;
    const isVerified = user.isVerified;
    
    return (
     <div className="flex flex-col gap-1">
      <div
       className={cn(
        'w-fit px-2 py-1 rounded-full text-xs font-semibold leading-[140%] flex items-center justify-center',
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
       )}
      >
       {isActive ? 'Active' : 'Inactive'}
      </div>
      {isVerified && (
       <div className="w-fit px-2 py-1 rounded-full text-xs font-semibold leading-[140%] flex items-center justify-center bg-blue-100 text-blue-800">
        Verified
       </div>
      )}
     </div>
    );
   },
  },
  {
   header: '',
   accessor: 'action',
   cell: (info) => {
    const user = info.row.original;

    return (
     <DropdownMenu>
      <DropdownMenuTrigger
       asChild
       onClick={(e) => e.stopPropagation()}
      >
       <div className="size-[20px] rounded-full p-0 flex items-center justify-center cursor-pointer bg-[#F4F7FE] hover:bg-gray-100 ">
        <MoreHorizontal className="size-4 text-primary500" />
       </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
       align="end"
       className="w-[159px] py-[10px] border-[#E5E7E8] shadow-[0px_4px_24px_0px_#191B1C29]"
      >
       <DropdownMenuItem 
        className="p-0 text-sm text-gray600 leading-[140%] px-3 py-1.5"
        onClick={(e) => {
         e.stopPropagation();
         navigate(`/dashboard/user-management/${user._id}`);
        }}
       >
        <PiDownloadSimple className="mr-2 size-4" />
        <span>View Details</span>
       </DropdownMenuItem>
      </DropdownMenuContent>
     </DropdownMenu>
    );
   },
  },
 ];
 return (
  <Card className=" shadow-none rounded-[8px] bg-white pb-4 w-full mt-4">
   <div className="flex items-center justify-between px-4 py-8">
    <h2 className="font-outfit text-[#2B3674] text-[18px] font-extrabold leading-[140%]">
     Recent Users
    </h2>
    <button
     onClick={() => navigate('/dashboard/user-management')}
     className="text-primary500 text-sm font-medium hover:text-primary600 transition-colors"
    >
     View All
    </button>
   </div>
   <div>
    {isLoading ? (
     <div className="px-4 pb-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0 w-full justify-between">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-16" />
       </div>
      ))}
     </div>
    ) : users.length === 0 ? (
     <div className="px-4 pb-4 text-center py-8">
      <p className="text-gray-500">No recent users</p>
     </div>
    ) : (
     <DataTable
      tableColumns={usersColumns}
      tableData={users}
      enableGlobalFilter={false}
      enablePagination={false}
      showPagination={false}
      showSearch={false}
      emptyHeading="No users found"
      emptySubtitle="There are no users to display."
      loading={false}
      serverSidePagination={false}
      manualPagination={false}
     />
    )}
   </div>
  </Card>
 );
};

export default DashboardUserMgtTable;
