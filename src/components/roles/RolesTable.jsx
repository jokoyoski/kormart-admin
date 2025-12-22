import { useState } from 'react';
import {
 Search,
 Edit,
 Trash2,
 MoreHorizontal,
 Plus,
} from 'lucide-react';
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
import { useGetAllRoles } from '@/api/roles/get-roles';
import { useDeleteRole } from '@/api/roles/create-role';
import { useTableFilters } from '@/hooks/useTableFilters';

const RolesTable = ({ onEditRole, handleCreateRole }) => {
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
 const [editingRole, setEditingRole] = useState(null);

 const deleteRoleMutation = useDeleteRole();

 // Fetch roles with server-side pagination and search
 const { data: rolesResponse, isLoading } = useGetAllRoles({
  page: currentPage,
  search: searchFilter,
  limit: itemsPerPage,
 });

 // Extract data from response
 const roles = rolesResponse?.data || [];
 const meta = rolesResponse?.meta || {
  count: 0,
  totalPages: 0,
  currentPage: 1,
 };

 const handleDeleteRole = async () => {
  try {
   await deleteRoleMutation.mutateAsync(editingRole.id);
  } catch (error) {
   console.log(error);
  } finally {
   setEditingRole(null);
   setOpenDeleteModal(false);
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

 // Format permissions for display
 const formatPermissions = (permissions) => {
  if (permissions.includes('all')) return 'All Permissions';
  return permissions
   .map((p) =>
    p.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
   )
   .join(', ');
 };

 return (
  <>
   <Card className="shadow-none rounded-[8px] bg-white py-4 w-full">
    <div className="mb-6">
     {/* Search */}
     <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6 px-4 md:px-7">
      <div className=" !text-primary font-semibold font-outfit rounded-none bg-transparent font-regular leading-[140%] text-base uppercase">
       ROLES
      </div>

      <div className="relative w-full sm:max-w-[310px]">
       <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
       <Input
        placeholder="Search Role"
        value={searchFilter}
        onChange={handleSearchChange}
        className="pl-9 w-full bg-[#F2F3F480] h-12 border-none rounded-[4px] focus:ring-none text-gray-900 text-sm placeholder:text-gray-400"
       />
      </div>

      <Button
       onClick={handleCreateRole}
       className="bg-[#F1C40F] h-[50px] flex justify-center items-center hover:bg-[#F1C40F]/90 text-black font-semibold px-6 py-2 rounded-[4px] whitespace-nowrap"
      >
       <Plus className="h-4 w-4 mr-2" />
       Add Role
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
           Name
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Description
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Permissions
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Created Date
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
            <Skeleton className="h-7 w-32" />
           </TableCell>
           <TableCell className="py-3 pl-8">
            <Skeleton className="h-7 w-24" />
           </TableCell>
           <TableCell className="py-6 pr-14">
            <Skeleton className="h-8 w-16" />
           </TableCell>
          </TableRow>
         ))}
        </TableBody>
       </Table>
      </div>
     ) : roles.length === 0 ? (
      // Empty State
      <div className="w-full flex flex-col items-center justify-center py-12">
       <div className="text-center">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
         {searchFilter ? 'No roles found' : 'No roles yet'}
        </h3>
        <p className="text-gray-500 mb-4">
         {searchFilter
          ? `We couldn't find any roles matching "${searchFilter}". Try adjusting your search.`
          : 'Get started by creating your first role.'}
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
          onClick={() => onEditRole()}
          className="bg-blue100 text-white"
         >
          <Search className="h-4 w-4 mr-2" />
          Add New Role
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
           Name
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Description
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Permissions
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Created Date
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 w-10 pb-6"></TableHead>
         </TableRow>
        </TableHeader>
        <TableBody>
         {roles.map((role, index) => (
          <TableRow
           key={role.id}
           className="border-none border-[#E5E7E8] hover:bg-[#F0F6FF] transition-colors"
          >
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B]">
            {currentPage * itemsPerPage + index + 1}
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B] text-left">
            {role.name}
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B] text-left max-w-[200px]">
            <div
             className="truncate"
             title={role.description || 'No description'}
            >
             {role.description || 'No description'}
            </div>
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B] text-left max-w-[300px]">
            <div
             className="truncate capitalize"
             title={formatPermissions(role.permissions)}
            >
             {formatPermissions(role.permissions)}
            </div>
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B] text-left">
            {new Date(role.createdAt).toLocaleDateString('en-US', {
             year: 'numeric',
             month: 'short',
             day: 'numeric',
             hour: '2-digit',
             minute: '2-digit',
            })}
           </TableCell>
           <TableCell className="py-3 pr-14">
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
              className="w-[150px]"
             >
              <DropdownMenuItem
               onClick={(e) => {
                e.stopPropagation();
                onEditRole(role);
               }}
              >
               <Edit className="mr-2 h-4 w-4" />
               <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
               onClick={(e) => {
                e.stopPropagation();
                setEditingRole(role);
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
    {!isLoading && roles.length > 0 && (
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
    title="Delete Role"
    confirmText="Yes, delete role"
    onConfirm={handleDeleteRole}
    isLoading={deleteRoleMutation.isPending}
   >
    <p className="text-sm leading-[150%] text-gray800">
     <span className="font-medium text-neutralBlack">
      Are you sure you want to delete this role?
     </span>{' '}
     This action cannot be undone. Please confirm if you want to
     proceed.
    </p>
   </DeleteAccountModal>
  </>
 );
};

export default RolesTable;
