'use client';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';

export const Pagination = ({
 table,
 perPageOptions = [10, 25, 50, 100],
 totalItemsCount,
 showPagination = true,
 serverSidePagination = false,
 loading = false,
}) => {
 const paginationState = table.getState().pagination;
 const currentPage = paginationState.pageIndex;
 const pageSize = paginationState.pageSize;

 // Keep a stable copy of totalPages to prevent UI shifts during loading
 const [stableTotalPages, setStableTotalPages] = useState(
  Math.ceil(totalItemsCount / pageSize) || 1,
 );

 // Only update stableTotalPages when not loading and totalItemsCount changes
 useEffect(() => {
  if (!loading) {
   setStableTotalPages(Math.ceil(totalItemsCount / pageSize) || 1);
  }
 }, [totalItemsCount, pageSize, loading]);

 // Use the stable total pages for rendering
 const totalPages = stableTotalPages;

 // Handle page change for server-side pagination
 const handlePageChange = (newPage) => {
  if (serverSidePagination) {
   // For server-side pagination, we use the custom setPagination method
   // that was set up in the DataTable component
   table.setPagination({
    ...paginationState,
    pageIndex: newPage,
   });
  } else {
   // For client-side pagination, use the built-in method
   table.setPageIndex(newPage);
  }
 };

 // Handle previous page
 const handlePreviousPage = () => {
  if (currentPage > 0) {
   handlePageChange(currentPage - 1);
  }
 };

 // Handle next page
 const handleNextPage = () => {
  if (currentPage < totalPages - 1) {
   handlePageChange(currentPage + 1);
  }
 };

 // Check if can go to previous/next page
 const canPreviousPage = currentPage > 0;
 const canNextPage = currentPage < totalPages - 1;

 const renderPageNumbers = () => {
  const pageNumbers = [];

  const addPageButton = (page) => {
   pageNumbers.push(
    <div
     key={page}
     //  variant="outline"
     //  size="sm"
     onClick={() => handlePageChange(page)}
     disabled={loading}
     className={cn(
      'flex size-10 items-center border-none justify-center rounded-full bg-white text-sm font-semibold leading-[140%]',
      page === currentPage
       ? '!bg-primary text-white'
       : 'border-0 text-[#50555C] hover:bg-gray-50',
     )}
    >
     {page + 1 > 9 ? page + 1 : `0${page + 1}`}
    </div>,
   );
  };

  if (totalPages > 0) {
   addPageButton(0); // First page

   if (totalPages <= 6) {
    // Show all pages if there are less than or equal to 6 pages
    for (let i = 1; i < totalPages; i++) {
     addPageButton(i);
    }
   } else {
    // Show paginated with ellipsis when there are more than 6 pages
    if (currentPage > 4 && currentPage < totalPages - 3) {
     addPageButton(1);
     pageNumbers.push(
      <span
       key="start-ellipsis"
       className="text-gray-600"
      >
       ...
      </span>,
     );
     addPageButton(currentPage - 1);
     addPageButton(currentPage);
     addPageButton(currentPage + 1);
     pageNumbers.push(
      <span
       key="end-ellipsis"
       className="text-gray-600"
      >
       ...
      </span>,
     );
    } else if (currentPage <= 4) {
     // Show the first few pages and ellipsis
     for (let i = 1; i <= 4; i++) {
      if (i < totalPages) {
       // Make sure we don't exceed totalPages
       addPageButton(i);
      }
     }
     if (totalPages > 6) {
      pageNumbers.push(
       <span
        key="end-ellipsis"
        className="text-gray-600"
       >
        ...
       </span>,
      );
     }
    } else {
     // Show the last few pages and ellipsis
     pageNumbers.push(
      <span
       key="start-ellipsis"
       className="text-gray-600"
      >
       ...
      </span>,
     );
     for (let i = totalPages - 4; i < totalPages; i++) {
      addPageButton(i);
     }
    }

    // Only add last page button if totalPages > 1 and we're not already showing it
    if (totalPages > 1 && currentPage < totalPages - 4) {
     addPageButton(totalPages - 1); // Last page
    }
   }
  }

  return pageNumbers;
 };

 if (!showPagination) {
  return null;
 }

 return (
  <div className="flex flex-col-reverse justify-end gap-3 borde-t border-[#E5E7E8] px-6 py-6 md:flex-row md:items-center mt-[2px]">
   {/* Pagination buttons */}
   <div className="flex items-center gap-1">
    <div
     className="flex !size-10 rounded-full items-center justify-center bg-light-background border-none"
     onClick={handlePreviousPage}
     disabled={!canPreviousPage || loading}
    >
     <IoArrowBack className="size-4 text-primary" />
     <span className="sr-only">Go to previous page</span>
    </div>

    <div className="flex items-center space-x-1">
     {renderPageNumbers()}
    </div>

    <div
     className="flex !size-10 rounded-full items-center justify-center bg-light-background border-none"
     onClick={handleNextPage}
     disabled={!canNextPage || loading}
    >
     <IoArrowForward className="size-4 text-primary" />
     <span className="sr-only">Go to next page</span>
    </div>
   </div>
  </div>
 );
};

export const ServerSidePagination = Pagination;
export const ClientSidePagination = Pagination;
