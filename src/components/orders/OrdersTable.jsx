import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MoreHorizontal, Search } from 'lucide-react';
import { PiDownloadSimple } from 'react-icons/pi';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import DataTable from '../ui/data-table';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { useGetAllOrders } from '@/api/orders/get-orders';
import { useTableFilters } from '@/hooks/useTableFilters';
import { format } from 'date-fns';

const OrderTable = () => {
 const navigate = useNavigate();
 const [searchParams, setSearchParams] = useSearchParams();

 // Use custom hook for table filters and pagination
 const {
  searchFilter,
  currentPage,
  itemsPerPage,
  handleSearchChange,
  setCurrentPage,
 } = useTableFilters({ itemsPerPage: 20 });

 // Get tab from URL or default to 'all'
 const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');

 // Update URL params when tab changes
 useEffect(() => {
  const newParams = new URLSearchParams(searchParams);
  newParams.set('tab', activeTab);
  setSearchParams(newParams, { replace: true });
 }, [activeTab, searchParams, setSearchParams]);

 // Fetch orders with server-side pagination and filters
 const { data: ordersResponse, isLoading } = useGetAllOrders({
  page: currentPage,
  search: searchFilter,
  orderStatus: activeTab === 'all' ? '' : activeTab,
  limit: itemsPerPage,
 });

 // Extract data from response
 const orders = ordersResponse?.data || [];
 const meta = ordersResponse?.meta || { count: 0, totalPages: 0, currentPage: 1 };

 // Handle tab change
 const handleTabChange = (value) => {
  setActiveTab(value);
  setCurrentPage(0); // Reset to first page when changing tabs
 };

 // Tab configuration
 const orderStatusTabs = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
 ];

 const tabTriggerClassName = "px-3 h-full data-[state=active]:border-r-2 data-[state=active]:border-primary data-[state=active]:!text-primary data-[state=active]:font-semibold data-[state=active]:font-outfit font-urbanist rounded-none bg-transparent font-regular leading-[140%] text-base uppercase whitespace-nowrap";

 // Table columns for orders
 const ordersColumns = [
  {
   header: 'NO',
   accessor: 'index',
   enableSorting: false,
   cell: (info) => {
    return <span>{currentPage * itemsPerPage + info.row.index + 1}</span>;
   },
  },

  {
   header: 'Order ID',
   accessor: 'orderId',
   enableSorting: false,
   cell: (info) => {
    const order = info.row.original;
    return <span className="block min-w-[120px] font-mono text-sm">{order.orderId || order.id}</span>;
   },
  },
  {
   header: 'Product',
   accessor: 'product',
   enableSorting: false,
   cell: (info) => {
    const order = info.row.original;
    return (
     <div className="min-w-[150px]">
      <div className="font-semibold">{order.product?.name || 'N/A'}</div>
      <div className="text-xs text-gray-500">Price: ₦{parseFloat(order.product?.price || 0).toLocaleString()}</div>
     </div>
    );
   },
  },
  {
   header: 'Buyer',
   accessor: 'buyer',
   enableSorting: false,
   cell: (info) => {
    const order = info.row.original;
    return (
     <div>
      <div className="font-semibold">{order.buyer?.userDetails?.fullName || order.buyer?.email || 'N/A'}</div>
      <div className="text-xs text-gray-500">{order.buyer?.email}</div>
     </div>
    );
   },
  },

  {
   header: 'Date Created',
   accessor: 'createdAt',
   enableSorting: false,
   cell: (info) => {
    const date = info.getValue()
    return <span>{format(new Date(date), 'MMM d, yyyy h:mm a')}</span>;
    // return <span>{date.toLocaleDateString()}</span>;
   },
  },
  {
   header: 'Amount',
   accessor: 'agreedPrice',
   enableSorting: false,
   cell: (info) => {
    const amount = parseFloat(info.getValue() || 0);
    return <span className="font-semibold">₦{amount.toLocaleString()}</span>;
   },
  },

  {
   header: 'Order Status',
   accessor: 'orderStatus',
   enableSorting: false,
   cell: (info) => {
    const status = info.getValue();
    return (
     <div
      className={cn(
       'w-fit px-3 py-1 rounded-full text-xs font-semibold leading-[140%] flex items-center justify-center',
       status === 'pending' && 'bg-yellow-100 text-yellow-800',
       status === 'processing' && 'bg-blue-100 text-blue-800',
       status === 'delivered' && 'bg-green-100 text-green-800',
       status === 'completed' && 'bg-green-100 text-green-800',
       status === 'cancelled' && 'bg-red-100 text-red-800',
       status === 'returned' && 'bg-orange-100 text-orange-800',
      )}
     >
      {status?.charAt(0).toUpperCase() + status?.slice(1) || 'N/A'}
     </div>
    );
   },
  },
  {
   header: '',
   accessor: 'action',
   cell: (info) => {
    const order = info.row.original;

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
         navigate(`/dashboard/orders/${order.id}`);
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
  <Card className=" shadow-none rounded-[8px] bg-white pt-4 pb-4 w-full mt-6">
   <div className="px-4 mb-6">
    {/* tabs */}
    <Tabs
     value={activeTab}
     onValueChange={handleTabChange}
     className="w-full"
    >
     <div className="overflow-x-auto mb-4 scrollbar-hide">
      <TabsList className="w-max min-w-full justify-start bg-transparent h-12 items-center p-0 gap-0">
       {orderStatusTabs.map((tab) => (
        <TabsTrigger
         key={tab.value}
         value={tab.value}
         className={tabTriggerClassName}
        >
         {tab.label}
        </TabsTrigger>
       ))}
      </TabsList>
     </div>
    </Tabs>

    {/* Search bar */}
    <div className="flex items-center">
     <div className="relative w-full max-w-[290px]">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray900" />
      <Input
       placeholder="Search orders..."
       value={searchFilter}
       onChange={handleSearchChange}
       className="pl-9 w-full bg-[#F2F3F480] h-10 border-none rounded-[4px]  focus:ring-none text-gray900 text-sm placeholder:text-gray400"
      />
     </div>
    </div>
   </div>
   <div>
    <DataTable
     tableColumns={ordersColumns}
     tableData={orders || []}
     enableGlobalFilter={true}
     enablePagination={true}
     showPagination={true}
     showSearch={false}
     perPageOptions={[10, 20, 30, 50]}
     emptyHeading="No Orders found"
     emptySubtitle="There are no Orders matching your search criteria."
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
 );
};

export default OrderTable;
