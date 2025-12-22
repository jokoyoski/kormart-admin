import { useGetACategory } from '@/api/categories/get-categories';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
 ChevronRight,
 Edit3,
 Edit3Icon,
 MoreHorizontal,
 Plus,
 Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteAccountModal from '@/components/modals/DeleteAccountModal';
import {
 useDeleteCategory,
 useUpdateCategory,
} from '@/api/categories/create-category';
import {
 useCreateSubCategory,
 useDeleteSubCategory,
 useUpdateSubCategory,
} from '@/api/categories/create-subcategory';
import { Skeleton } from '@/components/ui/skeleton';
import CreateCategoryModal from '@/components/categories/CreateCategoryModal';
import CreateSubCategoryModal from '@/components/categories/CreateSubCategoryModal';
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from '@/components/ui/table';
import deleteImg from '@/assets/delete.png';
const CategoryDetailsPage = () => {
 const { id } = useParams();
 const navigate = useNavigate();

 const {
  data: categoryResponse,
  isLoading,
  error,
 } = useGetACategory(id);
 const updateCategory = useUpdateCategory();
 const updateSubCategory = useUpdateSubCategory(id);
 const deleteCategoryMutation = useDeleteCategory();
 const deleteSubCategory = useDeleteSubCategory(id);
 const createSubCategory = useCreateSubCategory(id);

 // Extract category data from response
 const categoryData = categoryResponse?.data || null;

 const [showCategoryModal, setShowCategoryModal] = useState(false);
 const [showSubcategoryModal, setShowSubcategoryModal] =
  useState(false);
 const [editingSubcategory, setEditingSubcategory] = useState(null);
 const [openDeleteModal, setOpenDeleteModal] = useState(false);
 const [openDeleteSubModal, setOpenDeleteSubModal] = useState(false);

 const handleDeleteCategory = async () => {
  try {
   await deleteCategoryMutation.mutateAsync(id);
   setOpenDeleteModal(false);
   navigate('/dashboard/categories');
  } catch (error) {
   console.log(error);
   setOpenDeleteModal(false);
  }
 };
 const handleDeleteSubCategory = async () => {
  try {
   await deleteSubCategory.mutateAsync(editingSubcategory?.id);
   setOpenDeleteSubModal(false);
   setEditingSubcategory(null);
  } catch (error) {
   console.log(error);
   setOpenDeleteSubModal(false);
   setEditingSubcategory(null);
  }
 };
 const handleEditCategory = () => {
  // console.log('first');
  setShowCategoryModal(true);
 };

 const handleCreateSubcategory = () => {
  setEditingSubcategory(null);
  setShowSubcategoryModal(true);
 };

 const handleEditSubcategory = (subcategory) => {
  setEditingSubcategory(subcategory);
  setShowSubcategoryModal(true);
 };

 const handleCategorySubmit = async (payload) => {
  try {
   // Handle the category creation/update here

   await updateCategory.mutateAsync({
    category_id: id,
    payload: {
     name: payload?.name,
     description: payload?.description,
     imageUrl: payload?.image,
    },
   });

   setShowCategoryModal(null);
  } catch (error) {
   console.log(error);
  }
  //   console.log('Category submitted:', payload);
 };

 const handleSubcategorySubmit = async (payload) => {
  try {
   if (editingSubcategory) {
    await updateSubCategory.mutateAsync({
     sub_category_id: editingSubcategory?.id,
     payload: {
      name: payload?.name,
      description: payload?.description,
      imageUrl: payload?.image,
     },
    });
   } else {
    await createSubCategory.mutateAsync({
     name: payload?.name,
     description: payload?.description,
     imageUrl: payload?.image,
    });
   }
   setShowSubcategoryModal(false);
   setEditingSubcategory(null);
  } catch (error) {
   console.log(error);
  }
 };

 if (isLoading) {
  return (
   <div className="w-full px-4 md:px-10">
    {/* Breadcrumb Skeleton */}
    <div className="mb-6">
     <Skeleton className="h-6 w-[300px] rounded mb-3" />
    </div>

    {/* Category Header Skeleton */}
    <Card className="shadow-none rounded-[8px] bg-white w-full mb-6">
     <div className=" p-4 md:pl-6 md:pr-4 flex gap-3 md:gap-5 w-full">
      <Skeleton className="w-full md:max-w-[322px] h-[204px] rounded-[4px]" />
      <div className="flex-1">
       <Skeleton className="h-8 w-[200px] mb-4" />
       <Skeleton className="h-6 w-[150px] mb-2" />
       <Skeleton className="h-4 w-full mb-1" />
       <Skeleton className="h-4 w-[80%]" />
      </div>
     </div>
    </Card>

    {/* Subcategories Table Skeleton */}
    <Card className="shadow-none rounded-[8px] bg-white py-4 w-full">
     <div className="mb-6">
      <Skeleton className="h-8 w-[200px] mb-4 ml-8" />
      <div className="overflow-x-auto">
       <Table className="w-full min-w-[600px]">
        <TableHeader className="border-b border-[#D6DDEB]">
         <TableRow className="border-none hover:bg-transparent">
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 w-16 pb-6">
           #
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Name of Sub-Category
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Description
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 w-10 pb-6"></TableHead>
         </TableRow>
        </TableHeader>
        <TableBody>
         {[...Array(3)].map((_, index) => (
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
           <TableCell className="py-3 pr-14">
            <Skeleton className="h-8 w-16" />
           </TableCell>
          </TableRow>
         ))}
        </TableBody>
       </Table>
      </div>
     </div>
    </Card>
   </div>
  );
 }

 if (error) {
  return (
   <div className="w-full px-4 md:px-10">
    <div className="mb-6">
     <Skeleton className="h-6 w-[300px] rounded mb-3" />
    </div>
    <Card className="shadow-none rounded-[8px] w-full px-6 py-8">
     <div className="text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
       Error loading Category details
      </h3>
      <p className="text-gray-500">
       There was an error loading the category data. Please try again.
      </p>
      <Button
       onClick={() => window.location.reload()}
       className="mt-4"
      >
       Retry
      </Button>
     </div>
    </Card>
   </div>
  );
 }

 if (!categoryData) {
  return (
   <div className="w-full px-4 md:px-10">
    <div className="mb-6">
     <Skeleton className="h-6 w-[300px] rounded mb-3" />
    </div>
    <Card className="shadow-none rounded-[8px] w-full px-6 py-8">
     <div className="text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
       Category not found
      </h3>
      <p className="text-gray-500">
       The category you're looking for doesn't exist or has been
       removed.
      </p>
      <Button
       onClick={() => navigate('/dashboard/categories')}
       className="mt-4"
      >
       Back to Categories
      </Button>
     </div>
    </Card>
   </div>
  );
 }

 return (
  <div className="w-full px-4 md:px-10">
   {/* Breadcrumb */}
   <div className="mb-6 flex items-center leading-[140%] text-base md:text-[20px] font-medium">
    <Link
     to="/dashboard/categories"
     className="hover:text-blue100 text-[#32475CAD]"
    >
     Categories
    </Link>
    <ChevronRight className="h-4 w-4 mx-1" />
    <span className="text-blue100 font-medium">
     {categoryData?.name}
    </span>
   </div>

   {/* Category Header */}
   <Card className="shadow-none rounded-[8px] bg-white  w-full mb-6">
    <div className=" p-4 md:pl-6 md:pr-4 flex gap-3 md:gap-5 w-full flex-col md:flex-row">
     {/* Category Image */}
     <img
      src={categoryData?.imageUrl || '/placeholder.png'}
      alt={categoryData?.name}
      className="w-full md:max-w-[322px] max-h-[180px] md:max-h-[204px] rounded-[4px] object-cover"
     />

     {/* Category Details */}
     <div className="flex-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
       <h2 className="text-gray900 leading-[100%] text-[24px] md:text-[32px] font-semibold capitalize">
        {categoryData?.name}
       </h2>

       <div className="hidden md:flex items-center gap-3 ">
        <Button
         variant="outline"
         onClick={handleEditCategory}
         className="flex items-center text-primary  gap-2 bg-white rounded-[8px] border-primary leading-[24px] text-sm cursor-pointer"
        >
         <Edit3Icon className="h-4 w-4" />
         <span className="hidden md:inline">Edit Category</span>
        </Button>

        <Button
         variant="outline"
         onClick={() => setOpenDeleteModal(true)}
         className="flex items-center gap-2 cursor-pointer bg-white rounded-[8px] border border-red-300 text-red-600 hover:bg-red-50"
        >
         <Trash2 className="h-4 w-4" />
         <span className="hidden md:inline">Delete</span>
        </Button>
       </div>
      </div>

      <p className="text-[#7C8493] mt-1 md:mt-1.5 leading-[150%] text-[20px] md:text-[24px]">
       {categoryData?.subCategoriesCount || 0} Subcategories
      </p>

      <p className="text-sm md:text-base text-[#7C8493] leading-[20px] mt-1.5 max-w-[626px]">
       {categoryData?.description || 'No description available'}
      </p>

      <div className=" md:hidden flex items-center gap-3 mt-5 ">
       <Button
        variant="outline"
        onClick={handleEditCategory}
        className="flex items-center text-primary  gap-2 bg-white rounded-[8px] border-primary leading-[24px] text-sm cursor-pointer"
       >
        <Edit3Icon className="h-4 w-4" />
        <span className="hidden md:inline">Edit Category</span>
       </Button>

       <Button
        variant="outline"
        onClick={() => setOpenDeleteModal(true)}
        className="flex items-center gap-2 cursor-pointer bg-white rounded-[8px] border border-red-300 text-red-600 hover:bg-red-50"
       >
        <Trash2 className="h-4 w-4" />
        <span className="hidden md:inline">Delete</span>
       </Button>
      </div>
     </div>
    </div>
   </Card>

   {/* Subcategories Section */}
   <Card className="shadow-none rounded-[8px] bg-white py-4 w-full">
    <div className="mb-6">
     {/* Header with Add Button */}
     <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6 px-4 md:px-7">
      <div className="h-full  !text-primary font-semibold font-outfit  rounded-none bg-transparent font-regular leading-[140%] text-base uppercase">
       SUBCATEGORIES
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
       <Button
        onClick={handleCreateSubcategory}
        className="bg-[#F1C40F] h-[50px] flex justify-center items-center hover:bg-[#F1C40F]/90 text-black font-semibold px-6 py-2 rounded-[4px] whitespace-nowrap"
       >
        <Plus className="h-4 w-4 mr-2" />
        Create Subcategory
       </Button>
      </div>
     </div>

     {/* Subcategories Table or Empty State */}
     {categoryData?.subCategories &&
     categoryData.subCategories.length > 0 ? (
      <div className="overflow-x-auto mt-8">
       <Table className="w-full min-w-[600px]">
        <TableHeader className="border-b border-[#D6DDEB]">
         <TableRow className="border-none hover:bg-transparent">
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 w-16 pb-6">
           #
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Name of Sub-Category
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Description
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 w-10 pb-6"></TableHead>
         </TableRow>
        </TableHeader>
        <TableBody>
         {categoryData.subCategories.map((subCategory, index) => (
          <TableRow
           key={subCategory.id}
           className="border-none border-[#E5E7E8] hover:bg-[#F0F6FF] transition-colors"
          >
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B]">
            {index + 1}
           </TableCell>
           <TableCell className="py-3 pl-8 text-left  w-[350px]">
            <div className="flex items-center gap-3 ">
             <img
              src={subCategory.imageUrl || '/placeholder.png'}
              alt={subCategory.name}
              className="w-10 h-10 rounded-[4px] object-cover"
             />
             <span className="font-semibold text-base text-[#25324B]">
              {subCategory.name}
             </span>
            </div>
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B] text-left  max-w-[200px]">
            <div
             className="truncate"
             title={subCategory.description || 'No description'}
            >
             {subCategory.description || 'No description'}
            </div>
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
                handleEditSubcategory(subCategory);
               }}
              >
               <Edit3 className="mr-2 h-4 w-4" />
               <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
               onClick={(e) => {
                e.stopPropagation();
                setEditingSubcategory(subCategory);
                setOpenDeleteSubModal(true);
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
     ) : (
      // Empty State for Subcategories
      <div className="w-full flex flex-col items-center justify-center py-12">
       <div className="text-center">
        <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
         No subcategories yet
        </h3>
        <p className="text-gray-500 mb-4">
         Get started by creating your first subcategory for this
         category.
        </p>
        <Button
         variant="primary"
         onClick={handleCreateSubcategory}
         className="bg-blue100 text-white"
        >
         <Plus className="h-4 w-4 mr-2" />
         Add New Subcategory
        </Button>
       </div>
      </div>
     )}
    </div>
   </Card>

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

   <DeleteAccountModal
    open={openDeleteSubModal}
    setOpen={setOpenDeleteSubModal}
    title="Delete SubCategory"
    confirmText="Yes, delete subcategory"
    onConfirm={handleDeleteSubCategory}
    isLoading={deleteSubCategory.isPending}
   >
    <p className="text-sm leading-[150%] text-gray800">
     <span className="font-medium text-neutralBlack">
      Are you sure you want to delete this sub category?
     </span>{' '}
     This action cannot be undone. Please confirm if you want to
     proceed.
    </p>
   </DeleteAccountModal>

   <CreateCategoryModal
    isOpen={showCategoryModal}
    onClose={() => setShowCategoryModal(false)}
    onSubmit={handleCategorySubmit}
    initialData={categoryData}
    isLoading={updateCategory?.isPending}
   />

   <CreateSubCategoryModal
    isOpen={showSubcategoryModal}
    onClose={() => setShowSubcategoryModal(false)}
    onSubmit={handleSubcategorySubmit}
    initialData={editingSubcategory}
    categoryId={id}
    isLoading={
     createSubCategory?.isPending || updateSubCategory?.isPending
    }
   />
  </div>
 );
};

export default CategoryDetailsPage;
