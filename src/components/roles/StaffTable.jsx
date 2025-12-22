import { useState } from 'react';
import { Search, Edit, Trash2, MoreHorizontal, Plus, UserCheck, UserX } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from '@/components/ui/table';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/ui/pagination';
import DeleteAccountModal from '@/components/modals/DeleteAccountModal';
import CustomConfirmModal from '@/components/modals/CustomConfirmModal';
import { useGetAllStaff } from '@/api/roles/get-staff';
import { useDeleteStaff } from '@/api/roles/create-staff';
import { useActivateStaff, useDeactivateStaff } from '@/api/roles/staff-actions';
import { useTableFilters } from '@/hooks/useTableFilters';

const StaffTable = ({ onEditStaff, handleCreateStaff }) => {
 // Use custom hook for table filters and pagination
 const {
  searchFilter,
  currentPage,
  itemsPerPage,
  handleSearchChange,
  setCurrentPage,
  clearSearch,
 } = useTableFilters({ itemsPerPage: 20 });

 const [openDeleteModal, setOpenDeleteModal] = useState(false);
 const [editingStaff, setEditingStaff] = useState(null);
 const [openConfirmModal, setOpenConfirmModal] = useState(false);
 const [confirmAction, setConfirmAction] = useState(null);

 const deleteStaffMutation = useDeleteStaff();
 const activateStaffMutation = useActivateStaff();
 const deactivateStaffMutation = useDeactivateStaff();

 // Fetch staff with server-side pagination and search
 const { data: staffResponse, isLoading } = useGetAllStaff({
  page: currentPage,
  search: searchFilter,
  limit: itemsPerPage,
 });

 // Extract data from response
 const staff = staffResponse?.data || [];
 const meta = staffResponse?.meta || {
  count: 0,
  totalPages: 0,
  currentPage: 1,
 };

 const handleDeleteStaff = async () => {
  try {
   await deleteStaffMutation.mutateAsync(editingStaff.id);
  } catch (error) {
   console.log(error);
  } finally {
   setEditingStaff(null);
   setOpenDeleteModal(false);
  }
 };

 // Action handlers for activate/deactivate
 const handleActivateStaff = (staff) => {
  setConfirmAction({
   type: 'activate',
   title: 'Activate Staff Member',
   message: `Are you sure you want to activate ${staff.name}?`,
   action: () => activateStaffMutation.mutateAsync(staff.id)
  });
  setOpenConfirmModal(true);
 };

 const handleDeactivateStaff = (staff) => {
  setConfirmAction({
   type: 'deactivate',
   title: 'Deactivate Staff Member',
   message: `Are you sure you want to deactivate ${staff.name}?`,
   action: () => deactivateStaffMutation.mutateAsync(staff.id)
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

 // Mock table object for pagination component
 const mockTable = {
  getState: () => ({
   pagination: {
    pageIndex: currentPage,
    pageSize: itemsPerPage,
   },
  }),
  setPageIndex: (pageIndex) => setCurrentPage(pageIndex),
  setPagination: (updater) => {
   const newPagination =
    typeof updater === 'function'
     ? updater({ pageIndex: currentPage, pageSize: itemsPerPage })
     : updater;
   setCurrentPage(newPagination.pageIndex);
  },
 };

 return (
  <>
   <Card className="shadow-none rounded-[8px] bg-white py-4 w-full">
    <div className="mb-6">
     {/* Search */}
     <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6 px-4 md:px-7">
       <div className="  !text-primary font-semibold font-outfit rounded-none bg-transparent font-regular leading-[140%] text-base uppercase">
        STAFF MEMBERS
       </div>
  

      <div className="relative w-full sm:max-w-[310px]">
       <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
       <Input
        placeholder="Search Members"
        value={searchFilter}
        onChange={handleSearchChange}
        className="pl-9 w-full bg-[#F2F3F480] h-12 border-none rounded-[4px] focus:ring-none text-gray-900 text-sm placeholder:text-gray-400"
       />
      </div>

      <Button
       onClick={handleCreateStaff}
       className="bg-[#F1C40F] h-[50px] flex justify-center items-center hover:bg-[#F1C40F]/90 text-black font-semibold px-6 py-2 rounded-[4px] whitespace-nowrap"
      >
       <Plus className="h-4 w-4 mr-2" />
       Add Members
      </Button>
     </div>

     {/* Loading State */}
     {isLoading ? (
      <div className="overflow-x-auto mt-8">
       <Table className="w-full min-w-[600px]">
        <TableHeader className="border-b border-[#D6DDEB]">
         <TableRow className="border-none hover:bg-transparent">
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 w-16 pb-6">
           #
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Full Name
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Email
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Role
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Status
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 w-10 pb-6"></TableHead>
         </TableRow>
        </TableHeader>
        <TableBody>
         {[...Array(5)].map((_, index) => (
          <TableRow
           key={index}
           className="border-none border-[#E5E7E8] hover:bg-[#F0F6FF] transition-colors"
          >
           <TableCell className="py-3 pl-8">
            <Skeleton className="h-7 w-8" />
           </TableCell>
           <TableCell className="py-3 pl-8">
            <Skeleton className="h-7 w-32" />
           </TableCell>
           <TableCell className="py-3 pl-8">
            <Skeleton className="h-7 w-48" />
           </TableCell>
           <TableCell className="py-3 pl-8">
            <Skeleton className="h-7 w-24" />
           </TableCell>
           <TableCell className="py-3 pl-8">
            <Skeleton className="h-7 w-16" />
           </TableCell>
           <TableCell className="py-3 pr-14">
            <Skeleton className="h-8 w-16" />
           </TableCell>
          </TableRow>
         ))}
        </TableBody>
       </Table>
      </div>
     ) : staff.length === 0 ? (
      // Empty State
      <div className="w-full flex flex-col items-center justify-center py-12">
       <div className="text-center">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
         {searchFilter
          ? 'No staff members found'
          : 'No staff members yet'}
        </h3>
        <p className="text-gray-500 mb-4">
         {searchFilter
          ? `We couldn't find any staff members matching "${searchFilter}". Try adjusting your search.`
          : 'Get started by adding your first staff member.'}
        </p>
        {searchFilter ? (
         <Button
          variant="outline"
          onClick={clearSearch}
          className="text-blue100 border-blue100 hover:bg-blue-50"
         >
          Clear search
         </Button>
        ) : (
         <Button
          variant="primary"
          onClick={() => onEditStaff()}
          className="bg-blue100 text-white"
         >
          <Search className="h-4 w-4 mr-2" />
          Add New Staff Member
         </Button>
        )}
       </div>
      </div>
     ) : (
      // Table */}
      <div className="overflow-x-auto mt-8">
       <Table className="w-full min-w-[600px]">
        <TableHeader className="border-b border-[#D6DDEB]">
         <TableRow className="border-none hover:bg-transparent">
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 w-16 pb-6">
           #
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Full Name
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Email
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Role
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Status
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 w-10 pb-6"></TableHead>
         </TableRow>
        </TableHeader>
        <TableBody>
         {staff.map((staffMember, index) => (
          <TableRow
           key={staffMember.id}
           className="border-none border-[#E5E7E8] hover:bg-[#F0F6FF] transition-colors"
          >
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B]">
            {currentPage * itemsPerPage + index + 1}
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B] text-left">
            <div>
             <div className="font-semibold">{staffMember.name}</div>
             <div className="text-sm text-gray-500">
              {staffMember.email}
             </div>
            </div>
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B] text-left">
            {staffMember.email}
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B] text-left">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
             {staffMember.roles?.[0]?.name || 'No Role'}
            </span>
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B] text-left">
            <span
             className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              staffMember.isActive
               ? 'bg-green-100 text-green-800'
               : 'bg-red-100 text-red-800'
             }`}
            >
             {staffMember.isActive ? 'Active' : 'Inactive'}
            </span>
           </TableCell>
           <TableCell className="py-6 pr-14">
            <DropdownMenu>
             <DropdownMenuTrigger
              asChild
              onClick={(e) => e.stopPropagation()}
             >
              <button className="border-[#CCCCF5] border flex items-center justify-center text-[#646464] hover:bg-gray-50 text-sm font-bold w-[90px] h-[37px] bg-transparent rounded-[4px]">
               <MoreHorizontal className="w-3 h-3 mr-2.5" />
               Actions
              </button>
             </DropdownMenuTrigger>
             <DropdownMenuContent
              align="end"
              className="w-[180px]"
             >
              <DropdownMenuItem
               onClick={(e) => {
                e.stopPropagation();
                onEditStaff(staffMember);
               }}
              >
               <Edit className="mr-2 h-4 w-4" />
               <span>Edit</span>
              </DropdownMenuItem>
              
              {!staffMember.isActive ? (
               <DropdownMenuItem 
                className="text-green-600"
                onClick={(e) => {
                 e.stopPropagation();
                 handleActivateStaff(staffMember);
                }}
               >
                <UserCheck className="mr-2 h-4 w-4" />
                <span>Activate</span>
               </DropdownMenuItem>
              ) : (
               <DropdownMenuItem 
                className="text-red-600"
                onClick={(e) => {
                 e.stopPropagation();
                 handleDeactivateStaff(staffMember);
                }}
               >
                <UserX className="mr-2 h-4 w-4" />
                <span>Deactivate</span>
               </DropdownMenuItem>
              )}
              
              <DropdownMenuItem
               onClick={(e) => {
                e.stopPropagation();
                setEditingStaff(staffMember);
                setOpenDeleteModal(true);
               }}
               className="text-red-600"
              >
               <Trash2 className="mr-2 h-4 w-4" />
               <span>Delete</span>
              </DropdownMenuItem>
             </DropdownMenuContent>
            </DropdownMenu>
           </TableCell>
          </TableRow>
         ))}
        </TableBody>
       </Table>
      </div>
     )}
    </div>

    {/* Pagination */}
    {!isLoading && staff.length > 0 && (
     <div className="px-4">
      <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#E5E7E8] px-2 py-6 md:flex-row md:items-center">
       <div className="text-sm text-gray-600">
        Showing {currentPage * itemsPerPage + 1} to{' '}
        {Math.min((currentPage + 1) * itemsPerPage, meta.count)} of{' '}
        {meta.count} entries
       </div>

       <Pagination
        table={mockTable}
        totalItemsCount={meta.count}
        showPagination={true}
        serverSidePagination={true}
        loading={isLoading}
       />
      </div>
     </div>
    )}
   </Card>

   <DeleteAccountModal
    open={openDeleteModal}
    setOpen={setOpenDeleteModal}
    title="Delete Staff Member"
    confirmText="Yes, delete staff member"
    onConfirm={handleDeleteStaff}
    isLoading={deleteStaffMutation.isPending}
   >
    <p className="text-sm leading-[150%] text-gray800">
     <span className="font-medium text-neutralBlack">
      Are you sure you want to delete this staff member?
     </span>{' '}
     This action cannot be undone. Please confirm if you want to
     proceed.
    </p>
   </DeleteAccountModal>

   {/* Confirmation Modal for Activate/Deactivate */}
   <CustomConfirmModal
    open={openConfirmModal}
    setOpen={setOpenConfirmModal}
    title={confirmAction?.title || "Confirm Action"}
    secondaryBtnText={confirmAction?.title || "Confirm"}
    actionType={confirmAction?.type || "default"}
    onSecondaryBtnClick={handleConfirmAction}
    isLoading={activateStaffMutation.isPending || deactivateStaffMutation.isPending}
   >
    <p className="text-sm text-gray-600">
     {confirmAction?.message || "Are you sure you want to perform this action?"}
    </p>
   </CustomConfirmModal>
  </>
 );
};

export default StaffTable;
