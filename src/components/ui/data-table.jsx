'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import {
 createColumnHelper,
 flexRender,
 getCoreRowModel,
 getFilteredRowModel,
 getPaginationRowModel,
 getSortedRowModel,
 useReactTable,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function IndeterminateCheckbox({
 indeterminate,
 className = '',
 ...rest
}) {
 const ref = useRef(null);

 useEffect(() => {
  if (typeof indeterminate === 'boolean') {
   ref.current.indeterminate = !rest.checked && indeterminate;
  }
 }, [ref, indeterminate, rest.checked]);

 return (
  <input
   type="checkbox"
   ref={ref}
   className={className + ' accent-primary h-4 w-4 cursor-pointer'}
   {...rest}
  />
 );
}

export function DataTable({
 tableColumns,
 tableData = [],
 loading = false,
 enableRowSelection = false,
 enableMultiRowSelection = false,
 enableColumnFilters = false,
 enableGlobalFilter = true,
 enableSorting = true,
 enablePagination = true,
 manualPagination = false,
 manualSorting = false,
 manualFiltering = false,
 pageCount,
 serverSidePagination = false,
 currentPage = 0,
 perPage = 10,
 totalPageCount = 0,
 totalItemsCount = 0,
 onPaginationChange,
 onSortingChange,
 onRowSelectionChange,
 onGlobalFilterChange,
 searchFilter = '',
 setSearchFilter,
 showSearch = true,
 emptyHeading = 'No results found',
 emptySubtitle = "Try adjusting your search or filter to find what you're looking for.",
 onRowClick,
 rowClassName,
 containerClassName,
 tableClassName,
 showPagination = true,
 perPageOptions = [10, 25, 50, 100],
}) {
 const [sorting, setSorting] = useState([]);
 const [rowSelection, setRowSelection] = useState({});
 const [globalFilter, setGlobalFilter] = useState(searchFilter || '');

 const columnHelper = createColumnHelper();

 const columns = [
  columnHelper.accessor('select', {
   id: 'select',
   header: ({ table }) => (
    <IndeterminateCheckbox
     {...{
      checked: table.getIsAllRowsSelected(),
      indeterminate: table.getIsSomeRowsSelected(),
      onChange: table.getToggleAllRowsSelectedHandler(),
      className: 'accent-white',
     }}
    />
   ),
   cell: ({ row }) => (
    <IndeterminateCheckbox
     {...{
      checked: row.getIsSelected(),
      disabled: !row.getCanSelect(),
      indeterminate: row.getIsSomeSelected(),
      onChange: row.getToggleSelectedHandler(),
      onClick: (e) => e.stopPropagation(),
     }}
    />
   ),
   enableSorting: false,
  }),
  ...tableColumns.map(
   ({ header, accessor, cell: Cell, enableSorting }) =>
    columnHelper.accessor(accessor, {
     header,
     cell: (info) => (Cell ? <Cell {...info} /> : info.getValue()),
     enableSorting: enableSorting ? true : false,
    }),
  ),
 ];

 const data = useMemo(() => tableData, [tableData]);

 const table = useReactTable({
  data,
  columns: enableRowSelection ? columns : columns.slice(1),
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updater) => {
   const newSorting =
    typeof updater === 'function' ? updater(sorting) : updater;
   setSorting(newSorting);
   onSortingChange?.(newSorting);
  },
  onRowSelectionChange: (updater) => {
   const newRowSelection =
    typeof updater === 'function' ? updater(rowSelection) : updater;
   setRowSelection(newRowSelection);
   onRowSelectionChange?.(newRowSelection);
  },
  onGlobalFilterChange: (value) => {
   setGlobalFilter(value);
   setSearchFilter?.(value);
   onGlobalFilterChange?.(value);
  },
  enableRowSelection,
  enableMultiRowSelection,
  enableColumnFilters,
  enableGlobalFilter,
  enableSorting,
  manualPagination,
  manualSorting,
  manualFiltering,
  pageCount:
   totalPageCount || Math.ceil(totalItemsCount / perPage) || 1,
  state: {
   sorting,
   rowSelection,
   globalFilter: searchFilter || globalFilter,
   pagination: {
    pageIndex: serverSidePagination ? currentPage : 0,
    pageSize: perPage,
   },
  },
 });

 // Handle pagination change
 const handlePaginationChange = (updater) => {
  const newPagination =
   typeof updater === 'function'
    ? updater(table.getState().pagination)
    : updater;

  if (onPaginationChange) {
   onPaginationChange({
    currentPage: newPagination.pageIndex,
    perPage: newPagination.pageSize,
   });
  }
 };

 // Set up pagination change handler
 if (serverSidePagination && onPaginationChange) {
  table.setPagination = (updater) => {
   handlePaginationChange(updater);
  };
 }

 return (
  <div className={cn('space-y-4', containerClassName)}>
   {/* Search input */}
   {enableGlobalFilter && showSearch && (
    <div className="flex items-center ">
     <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
       placeholder="Search..."
       value={searchFilter || globalFilter}
       onChange={(e) => {
        setGlobalFilter(e.target.value);
        setSearchFilter?.(e.target.value);
       }}
       className="pl-9 bg-white h-10 border rounded-[8px] border-gray-300 focus:ring-none"
      />
     </div>
    </div>
   )}

   {/* Table */}
   <div className="roundd-xl bordr border-g bg-white">
    <div className="relative w-full overflow-auto">
     <table
      className={cn(
       'w-full caption-bottom text-sm min-w-[1100px] overflow-x-auto text-[#181336]',
       tableClassName,
      )}
     >
      <thead className="border border-[#E7EDF7] bg-[#F4F7FE] h-[61px] ">
       {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
         {headerGroup.headers.map((header) => {
          return (
           <th
            key={header.id}
            className="h-full items-center text-left font-semibold text-sm  leading-[140%] text-[#A3AED0] pl-8"
            style={{ width: header.getSize() }}
           >
            {header.isPlaceholder ? null : (
             <div
              className={cn(
               'flex items-center gap-1',
               header.column.getCanSort() &&
                'cursor-pointer select-none',
              )}
              onClick={header.column.getToggleSortingHandler()}
             >
              {flexRender(
               header.column.columnDef.header,
               header.getContext(),
              )}
              {header.column.getCanSort() && (
               <div className="flex flex-col justify-center items-center gap-[2px] ml-1">
                <svg
                 width="12"
                 height="8"
                 viewBox="0 0 12 8"
                 fill="none"
                 xmlns="http://www.w3.org/2000/svg"
                 className="rotate-180"
                >
                 <path
                  d="M10.7285 2.12476L6 6.85327L1.27148 2.12476L2.50586 0.890381L2.68262 1.06714L6 4.37769L9.31738 1.06714L9.49414 0.890381L10.7285 2.12476Z"
                  fill="#7C8493"
                  stroke={
                   header.column.getIsSorted() === 'asc'
                    ? '#7C8493'
                    : '#caccce'
                  }
                  strokeWidth="0.5"
                 />
                </svg>
                <svg
                 width="12"
                 height="8"
                 viewBox="0 0 12 8"
                 fill="none"
                 xmlns="http://www.w3.org/2000/svg"
                >
                 <path
                  d="M10.7285 2.12476L6 6.85327L1.27148 2.12476L2.50586 0.890381L2.68262 1.06714L6 4.37769L9.31738 1.06714L9.49414 0.890381L10.7285 2.12476Z"
                  fill="#7C8493"
                  stroke={
                   header.column.getIsSorted() === 'desc'
                    ? '#7C8493'
                    : '#caccce'
                  }
                  strokeWidth="0.5"
                 />
                </svg>
               </div>
              )}
             </div>
            )}
           </th>
          );
         })}
        </tr>
       ))}
      </thead>
      <tbody>
       {loading ? (
        // Loading state
        Array.from({ length: 5 }).map((_, index) => (
         <tr
          key={index}
          className="border-y border-[#E5E7E8]"
         >
          {Array.from({ length: columns.length }).map(
           (_, cellIndex) => (
            <td
             key={cellIndex}
             className="px-4 py-3"
            >
             <Skeleton className="h-6 w-full" />
            </td>
           ),
          )}
         </tr>
        ))
       ) : table.getRowModel().rows.length ? (
        // Data rows
        table.getRowModel().rows.map((row) => (
         <tr
          key={row.id}
          className={cn(
           'border border-[#E5E7E8] text-left transition-colors hover:bg-[#F0F6FF] font-medium leading-[140%] text-sm text-[#0C4DAE] ',
          //  row.id % 2 ? "bg-[#F0F6FF]" : "",
           rowClassName,
           onRowClick && 'cursor-pointer',
          )}
          onClick={() => onRowClick && onRowClick(row.original)}
         >
          {row.getVisibleCells().map((cell) => (
           <td
            key={cell.id}
            className=" py-[14px] pl-8"
           >
            {flexRender(
             cell.column.columnDef.cell,
             cell.getContext(),
            )}
           </td>
          ))}
         </tr>
        ))
       ) : (
        // Empty state
        <tr>
         <td
          colSpan={columns.length}
          className="px-4 py-8 text-center"
         >
          <div className="flex flex-col items-center justify-center gap-1">
           <p className="text-lg font-semibold text-gray900">
            {emptyHeading}
           </p>
           <p className="text-sm text-gray600">{emptySubtitle}</p>
          </div>
         </td>
        </tr>
       )}
      </tbody>
     </table>
    </div>

    {/* Pagination */}
    {enablePagination && showPagination && (
     <Pagination
      table={table}
      perPageOptions={perPageOptions}
      totalItemsCount={totalItemsCount || data.length}
      showPagination={showPagination}
      serverSidePagination={serverSidePagination}
      loading={loading} // Add this line to pass loading state
     />
    )}
   </div>
  </div>
 );
}

export default DataTable;
