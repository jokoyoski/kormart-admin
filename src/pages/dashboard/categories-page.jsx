import { useGetAllCategories } from '@/api/categories/get-categories';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
 Edit,
 MoreHorizontal,
 Plus,
 Search,
 Trash2,
} from 'lucide-react';
import { useState } from 'react';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import {
 useCreateCategory,
 useUpdateCategory,
 useDeleteCategory,
} from '@/api/categories/create-category';
import DeleteAccountModal from '@/components/modals/DeleteAccountModal';
import { Pagination } from '@/components/ui/pagination';
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from '@/components/ui/table';
import CreateCategoryModal from '@/components/categories/CreateCategoryModal';
import { useTableFilters } from '@/hooks/useTableFilters';

const CategoriesPage = () => {
 const navigate = useNavigate();

 // Use custom hook for table filters and pagination
 const {
  searchFilter,
  currentPage,
  itemsPerPage,
  handleSearchChange,
  setCurrentPage,
  clearSearch,
 } = useTableFilters({ itemsPerPage: 20 });

 // State management
 const [openDeleteModal, setOpenDeleteModal] = useState(false);
 const [editingCategory, setEditingCategory] = useState(null);
 const [showCategoryModal, setShowCategoryModal] = useState(false);

 // API hooks
 const createCategory = useCreateCategory();
 const updateCategory = useUpdateCategory();
 const deleteCategoryMutation = useDeleteCategory();

 // Fetch categories with server-side pagination and search
 const { data: categoriesResponse, isLoading } = useGetAllCategories({
  page: currentPage,
  search: searchFilter,
  limit: itemsPerPage,
 });

 // Extract data from response
 const categories = categoriesResponse?.data || [];
 const meta = categoriesResponse?.meta || {
  count: 0,
  totalPages: 0,
  currentPage: 1,
 };

 // Event handlers
 const handleCreateCategory = () => {
  setEditingCategory(null);
  setShowCategoryModal(true);
 };

 const handleEditCategory = (category) => {
  setEditingCategory(category);
  setShowCategoryModal(true);
 };

 const handleCategorySubmit = async (payload) => {
  try {
   if (editingCategory) {
    await updateCategory.mutateAsync({
     category_id: editingCategory?.id,
     payload: {
      name: payload?.name,
      description: payload?.description,
      imageUrl: payload?.image,
     },
    });
   } else {
    await createCategory.mutateAsync({
     name: payload?.name,
     description: payload?.description,
     imageUrl: payload?.image
    });
   }
   setShowCategoryModal(false);
   setEditingCategory(null);
  } catch (error) {
   console.log(error);
  }
 };

 const handleDeleteCategory = async () => {
  try {
   await deleteCategoryMutation.mutateAsync(editingCategory?.id);
  } catch (error) {
   console.log(error);
  } finally {
   setEditingCategory(null);
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

 return (
  <div className="w-full px-4 md:px-10">
   {/* Header */}
   <div className="mb-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-2">
     Manage Categories
    </h1>
    <p className="text-gray-600">
     Here is all your categories overview
    </p>
   </div>

   <Card className="shadow-none rounded-[8px] bg-white py-4 w-full">
    <div className="mb-6">
     {/* Search and Controls */}
     <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6 px-4 md:px-8">
      <div className="h-full  !text-primary font-semibold font-outfit  rounded-none bg-transparent font-regular leading-[140%] text-base uppercase">
       CATEGORY
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-[310px]">
       <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
       <Input
        placeholder="Search Category"
        value={searchFilter}
        onChange={handleSearchChange}
        className="pl-9 w-full bg-[#F2F3F480] h-12 border-none rounded-[4px] focus:ring-none text-gray-900 text-sm placeholder:text-gray-400"
       />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
       {/* Create Button */}
       <Button
        onClick={handleCreateCategory}
        className="bg-[#F1C40F] h-[50px] flex justify-center items-center hover:bg-[#F1C40F]/90 text-black font-semibold px-6 py-2 rounded-[4px] whitespace-nowrap"
       >
        Create Category
       </Button>
      </div>
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
           Name of Category
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Description
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           No of Sub-category
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
     ) : categories.length === 0 ? (
      // Empty State
      <div className="w-full flex flex-col items-center justify-center py-12">
       <div className="text-center">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
         {searchFilter ? 'No categories found' : 'No categories yet'}
        </h3>
        <p className="text-gray-500 mb-4">
         {searchFilter
          ? `We couldn't find any categories matching "${searchFilter}". Try adjusting your search.`
          : 'Get started by creating your first category.'}
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
          onClick={handleCreateCategory}
          className="bg-blue100 text-white"
         >
          <Plus className="h-4 w-4 mr-2" />
          Add New Category
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
           Name of Category
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Description
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           No of Sub-category
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 w-10 pb-6"></TableHead>
         </TableRow>
        </TableHeader>
        <TableBody>
         {categories.map((category, index) => (
          <TableRow
           key={category.id}
           className="border-none border-[#E5E7E8] hover:bg-[#F0F6FF] transition-colors cursor-pointer"
           onClick={() =>
            navigate(`/dashboard/category/${category.id}`)
           }
          >
           <TableCell className="py-6 pl-8 font-semibold text-base text-[#25324B]">
            {currentPage * itemsPerPage + index + 1}
           </TableCell>
           <TableCell className="py-3 pl-8 text-left">
            <div className="flex items-center gap-3">
             <img
              src={category.imageUrl || '/placeholder.png'}
              alt={category.name}
              className="w-10 h-10 rounded-[4px] object-cover"
             />
             <span className="font-semibold text-base text-[#25324B]">
              {category.name}
             </span>
            </div>
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B] text-left max-w-[200px]">
            <div
             className="truncate"
             title={category.description || 'No description'}
            >
             {category.description || 'No description'}
            </div>
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B] text-left">
            {category.subCategories?.length || 0}
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
                handleEditCategory(category);
               }}
              >
               <Edit className="mr-2 h-4 w-4" />
               <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
               onClick={(e) => {
                e.stopPropagation();
                setEditingCategory(category);
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
    {!isLoading && categories.length > 0 && (
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

   {/* Modals */}
   <CreateCategoryModal
    isOpen={showCategoryModal}
    onClose={() => setShowCategoryModal(false)}
    onSubmit={handleCategorySubmit}
    initialData={editingCategory}
    isLoading={createCategory?.isPending || updateCategory?.isPending}
   />

   <DeleteAccountModal
    open={openDeleteModal}
    setOpen={setOpenDeleteModal}
    title="Delete Category"
    confirmText="Yes, delete category"
    onConfirm={handleDeleteCategory}
    isLoading={deleteCategoryMutation.isPending}
   >
    <p className="text-sm leading-[150%] text-gray800">
     <span className="font-medium text-neutralBlack">
      Are you sure you want to delete this category?
     </span>{' '}
     This action cannot be undone. and it will remove all sub
     categories attached to it. Please confirm if you want to proceed.
    </p>
   </DeleteAccountModal>
  </div>
 );
};

export default CategoriesPage;
