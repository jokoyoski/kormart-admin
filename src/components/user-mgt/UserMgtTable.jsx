import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
 MoreHorizontal,
 Search,
 CheckCircle,
 XCircle,
 UserCheck,
 UserX,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import DataTable from '../ui/data-table';
import { useGetAllUsers } from '@/api/users/get-users';
import {
 useUpdateUserStatus,
 useVerifyUser,
 useUnverifyUser,
} from '@/api/users/user-actions';
import CustomConfirmModal from '../modals/CustomConfirmModal';
import { useTableFilters } from '@/hooks/useTableFilters';
import { UserDetailsSheet } from './UserDetailsSheet';

const UsersTable = () => {
 //  const navigate = useNavigate();
 const [selectedUser, setSelectedUser] = useState(null);
 const [isSheetOpen, setIsSheetOpen] = useState(false);

 // Use custom hook for table filters and pagination
 const {
  searchFilter,
  currentPage,
  itemsPerPage,
  handleSearchChange,
  setCurrentPage,
 } = useTableFilters({ itemsPerPage: 20 });

 const [openConfirmModal, setOpenConfirmModal] = useState(false);
 const [confirmAction, setConfirmAction] = useState(null);

 // API hooks
 const updateUserStatus = useUpdateUserStatus();
 const verifyUser = useVerifyUser();
 const unverifyUser = useUnverifyUser();

 // Fetch users with server-side pagination and search
 const { data: usersResponse, isLoading } = useGetAllUsers({
  page: currentPage,
  search: searchFilter,
  limit: itemsPerPage,
 });

 // Extract data from response
 const users = usersResponse?.data || [];
 const meta = usersResponse?.meta || {
  count: 0,
  totalPages: 0,
  currentPage: 1,
 };

 // Action handlers
 const handleActivateUser = (user) => {
  setConfirmAction({
   type: 'activate',
   title: 'Activate User',
   message: `Are you sure you want to activate ${user?.userDetails?.fullName || user.email}?`,
   action: () =>
    updateUserStatus.mutateAsync({
     userId: user.id,
     status: 'activate',
    }),
  });
  setOpenConfirmModal(true);
 };

 const handleDeactivateUser = (user) => {
  setConfirmAction({
   type: 'deactivate',
   title: 'Deactivate User',
   message: `Are you sure you want to deactivate ${user?.userDetails?.fullName || user.email}?`,
   action: () =>
    updateUserStatus.mutateAsync({
     userId: user.id,
     status: 'deactivate',
    }),
  });
  setOpenConfirmModal(true);
 };

 const handleVerifyUser = (user) => {
  setConfirmAction({
   type: 'verify',
   title: 'Verify User',
   message: `Are you sure you want to verify ${user?.userDetails?.fullName || user.email}?`,
   action: () => verifyUser.mutateAsync(user.id),
  });
  setOpenConfirmModal(true);
 };

 const handleUnverifyUser = (user) => {
  setConfirmAction({
   type: 'unverify',
   title: 'Revoke Verification',
   message: `Are you sure you want to revoke verification for ${user?.userDetails?.fullName || user.email}?`,
   action: () => unverifyUser.mutateAsync(user.id),
  });
  setOpenConfirmModal(true);
 };

 const handleConfirmAction = async () => {
  try {
   await confirmAction.action();
   setOpenConfirmModal(false);
   setConfirmAction(null);
  } catch (error) {
   console.error('Action failed:', error);
  }
 };

 // Table columns for users
 const usersColumns = [
  {
   header: 'NO',
   accessor: 'index',
   enableSorting: false,
   cell: (info) => {
    return (
     <span>{currentPage * itemsPerPage + info.row.index + 1}</span>
    );
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
   header: 'Phone',
   accessor: 'telephone',
   enableSorting: false,
   cell: (info) => {
    const value = info.row.original?.userDetails?.telephone || 'N/A';
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
        isActive
         ? 'bg-green-100 text-green-800'
         : 'bg-red-100 text-red-800',
       )}
      >
       {isActive ? 'Active' : 'Inactive'}
      </div>
      {isVerified ? (
       <div className="w-fit px-2 py-1 rounded-full text-xs font-semibold leading-[140%] flex items-center justify-center bg-blue-100 text-blue-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Verified
       </div>
      ) : (
       <div className="w-fit px-2 py-1 rounded-full text-xs font-semibold leading-[140%] flex items-center justify-center bg-gray-100 text-gray-600">
        <XCircle className="w-3 h-3 mr-1" />
        Not Verified
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
    const isActive = user.isActive;
    const isVerified = user.isVerified;

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
       className="w-[180px] py-[10px] border-[#E5E7E8] shadow-[0px_4px_24px_0px_#191B1C29]"
      >
       {/* <DropdownMenuItem className="p-0 text-sm text-gray600 leading-[140%] px-3 py-1.5">
        <PiDownloadSimple className="mr-2 size-4" />
        <span>View Details</span>
       </DropdownMenuItem> */}

       {!isActive ? (
        <DropdownMenuItem
         className="p-0 text-sm text-green-600 leading-[140%] px-3 py-1.5"
         onClick={(e) => {
          e.stopPropagation();
          handleActivateUser(user);
         }}
        >
         <UserCheck className="mr-2 size-4" />
         <span>Activate</span>
        </DropdownMenuItem>
       ) : (
        <DropdownMenuItem
         className="p-0 text-sm text-red-600 leading-[140%] px-3 py-1.5"
         onClick={(e) => {
          e.stopPropagation();
          handleDeactivateUser(user);
         }}
        >
         <UserX className="mr-2 size-4" />
         <span>Deactivate</span>
        </DropdownMenuItem>
       )}

       {!isVerified ? (
        <DropdownMenuItem
         className="p-0 text-sm text-blue-600 leading-[140%] px-3 py-1.5"
         onClick={(e) => {
          e.stopPropagation();
          handleVerifyUser(user);
         }}
        >
         <CheckCircle className="mr-2 size-4" />
         <span>Verify</span>
        </DropdownMenuItem>
       ) : (
        <DropdownMenuItem
         className="p-0 text-sm text-orange-600 leading-[140%] px-3 py-1.5"
         onClick={(e) => {
          e.stopPropagation();
          handleUnverifyUser(user);
         }}
        >
         <XCircle className="mr-2 size-4" />
         <span>Unverify</span>
        </DropdownMenuItem>
       )}
      </DropdownMenuContent>
     </DropdownMenu>
    );
   },
  },
 ];

 return (
  <>
   <Card className=" shadow-none rounded-[8px] bg-white pt-7 pb-4 w-full mt-5">
    <div className="flex items-center justify-end gap-6 px-4 mb-4">
     <div className="relative w-full max-w-[290px]">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray900" />
      <Input
       placeholder="Search users..."
       value={searchFilter}
       onChange={handleSearchChange}
       className="pl-9 w-full bg-[#F2F3F480] h-10 border-none rounded-[4px]  focus:ring-none text-gray900 text-sm placeholder:text-gray400"
      />
     </div>
    </div>
    <div>
     <DataTable
      tableColumns={usersColumns}
      tableData={users || []}
      enableGlobalFilter={true}
      enablePagination={true}
      showPagination={true}
      showSearch={false}
      perPageOptions={[10, 20, 30, 50]}
      emptyHeading="No users found"
      emptySubtitle="There are no users matching your search criteria."
      onRowClick={(data) => {
       setSelectedUser(data);
       setIsSheetOpen(true);
      }}
      loading={isLoading}
      serverSidePagination={true}
      manualPagination={true}
      totalItemsCount={meta.count}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
     />
    </div>
   </Card>

   {/* Confirmation Modal */}
   <CustomConfirmModal
    open={openConfirmModal}
    setOpen={setOpenConfirmModal}
    title={confirmAction?.title || 'Confirm Action'}
    secondaryBtnText={confirmAction?.title || 'Confirm'}
    actionType={confirmAction?.type || 'default'}
    onSecondaryBtnClick={handleConfirmAction}
    isLoading={
     updateUserStatus.isPending ||
     verifyUser.isPending ||
     unverifyUser.isPending
    }
   >
    <p className="text-sm text-gray-600">
     {confirmAction?.message ||
      'Are you sure you want to perform this action?'}
    </p>
   </CustomConfirmModal>

   {/* user details sheet */}
   <UserDetailsSheet
    open={isSheetOpen}
    onOpenChange={setIsSheetOpen}
    user={selectedUser}
   />
  </>
 );
};

export default UsersTable;
