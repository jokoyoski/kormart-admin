import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAllTransactions } from '@/api/transactions/get-transactions';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/button';
import { useTableFilters } from '@/hooks/useTableFilters';
import ServiceConfiguration from '@/components/transactions/ServiceConfiguration';

const TransactionsPage = () => {
 const [activeTab, setActiveTab] = useState('transactions');
 // Use custom hook for table filters and pagination
 const {
  searchFilter,
  currentPage,
  itemsPerPage,
  handleSearchChange,
  setCurrentPage,
  additionalState,
  updateAdditionalState,
 } = useTableFilters({ 
  itemsPerPage: 20,
  additionalParams: { transactionType: '', transactionStatus: '' }
 });

 const { transactionType, transactionStatus } = additionalState;

 // Fetch transactions with server-side pagination and filters
 const { data: transactionsResponse, isLoading } =
  useGetAllTransactions({
   page: currentPage,
   search: searchFilter,
   transactionType,
   transactionStatus,
   limit: itemsPerPage,
  });

 // Extract data from response
 const transactions = transactionsResponse?.data || [];
 const meta = transactionsResponse?.meta || {
  count: 0,
  totalPages: 0,
  currentPage: 1,
 };

 const clearFilters = () => {
  updateAdditionalState('transactionType', '');
  updateAdditionalState('transactionStatus', '');
  setCurrentPage(0);
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
   <div className="w-full pt-4">
    {/* Header */}
    <div className="mb-6">
     <h1 className="text-2xl font-bold text-gray-900 mb-2">
      Transactions
     </h1>
     <p className="text-gray-600">
      Manage and monitor all transaction activities
     </p>
    </div>

    {/* Tabs */}
    <Tabs
     value={activeTab}
     onValueChange={setActiveTab}
     className="w-full"
    >
     <TabsList className="mb-5 w-full justify-start h-[33px] items-start p-0 px-4 md:px-8 gap-8 bg-white">
      <TabsTrigger
       value="transactions"
       className="data-[state=active]:font-bold text-[#939393] data-[state=active]:text-[#3F3F3F] data-[state=active]:border-b-2 data-[state=active]:border-black !px-0 w-fit mx-0 pt-0"
      >
       Transactions
      </TabsTrigger>
      <TabsTrigger
       value="service-config"
       className="data-[state=active]:font-bold text-[#939393] data-[state=active]:text-[#3F3F3F] data-[state=active]:border-b-2 data-[state=active]:border-black !px-0 w-fit mx-0 pt-0"
      >
       Service Configuration
      </TabsTrigger>
     </TabsList>

     {/* Transactions Tab */}
     {activeTab === 'transactions' && (
      <div className="w-full">

    {/* Filters and Search */}
    <Card className="shadow-none rounded-[8px] bg-white py-4 w-full mt-5">
     <div className="flex flex-col lg:flex-row gap-4 px-4 md:px-7">
      {/* Search */}
      <div className="relative flex-1">
       <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
       <Input
        placeholder="Search transactions..."
        value={searchFilter}
        onChange={handleSearchChange}
        className="pl-9 w-full bg-[#F2F3F480] h-12 border-none rounded-[4px] focus:ring-none text-gray-900 text-sm placeholder:text-gray-400"
       />
      </div>

      <div className="flex gap-2 items-center">
       {/* Transaction Type Filter */}
       <div className="w-full lg:w-[200px]">
        <Select
         value={transactionType || 'all'}
         onValueChange={(value) =>
          updateAdditionalState('transactionType', value === 'all' ? '' : value)
         }
        >
         <SelectTrigger className="h-12 bg-[#F2F3F480] border-none">
          <SelectValue placeholder="Transaction Type" />
         </SelectTrigger>
         <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="deposit">Deposit</SelectItem>
          <SelectItem value="withdrawal">Withdrawal</SelectItem>
         </SelectContent>
        </Select>
       </div>

       {/* Transaction Status Filter */}
       <div className="w-full lg:w-[200px]">
        <Select
         value={transactionStatus || 'all'}
         onValueChange={(value) =>
          updateAdditionalState('transactionStatus', value === 'all' ? '' : value)
         }
        >
         <SelectTrigger className="h-12 bg-[#F2F3F480] border-none">
          <SelectValue placeholder="Status" />
         </SelectTrigger>
         <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="success">Success</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
         </SelectContent>
        </Select>
       </div>
      </div>

      {/* Clear Filters */}
      <Button
       variant="outline"
       onClick={clearFilters}
       className="h-12 px-4 border-gray-300"
      >
       <Filter className="h-4 w-4 mr-2" />
       Clear
      </Button>
     </div>

     {/* Loading State */}
     {isLoading ? (
      <div className="overflow-x-auto mt-8">
       <Table className="w-full min-w-[800px]">
        <TableHeader className="border-b border-[#D6DDEB]">
         <TableRow className="border-none hover:bg-transparent">
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 w-16 pb-6">
           #
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Transaction ID
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           User
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Amount
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Type
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Status
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Date
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
            <Skeleton className="h-7 w-20" />
           </TableCell>
           <TableCell className="py-3 pl-8">
            <Skeleton className="h-7 w-16" />
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
     ) : transactions.length === 0 ? (
      // Empty State
      <div className="w-full flex flex-col items-center justify-center py-12">
       <div className="text-center">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
         {searchFilter || transactionType || transactionStatus
          ? 'No transactions found'
          : 'No transactions yet'}
        </h3>
        <p className="text-gray-500 mb-4">
         {searchFilter || transactionType || transactionStatus
          ? "We couldn't find any transactions matching your criteria. Try adjusting your filters."
          : 'Transactions will appear here once they are created.'}
        </p>
        {(searchFilter || transactionType || transactionStatus) && (
         <Button
          variant="outline"
          onClick={clearFilters}
          className="text-blue100 border-blue100 hover:bg-blue-50"
         >
          Clear filters
         </Button>
        )}
       </div>
      </div>
     ) : (
      // Table
      <div className="overflow-x-auto mt-8">
       <Table className="w-full min-w-[800px]">
        <TableHeader className="border-b border-[#D6DDEB]">
         <TableRow className="border-none hover:bg-transparent">
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 w-16 pb-6">
           #
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Transaction ID
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           User
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Amount
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Type
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Status
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 pb-6">
           Date
          </TableHead>
          <TableHead className="text-left font-bold font-outfit text-base leading-[140%] text-[#646464] pl-8 w-10 pb-6"></TableHead>
         </TableRow>
        </TableHeader>
        <TableBody>
         {transactions.map((transaction, index) => (
          <TableRow
           key={transaction.id}
           className="border-none border-[#E5E7E8] hover:bg-[#F0F6FF] transition-colors"
          >
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B]">
            {currentPage * itemsPerPage + index + 1}
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B]">
            {transaction.transactionID ||
             transaction.transactionReference}
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B]">
            <div>
             <div className="font-semibold">
              {transaction.user?.email || 'N/A'}
             </div>
             <div className="text-sm text-gray-500">
              {transaction.user?.id
               ? `ID: ${transaction.user.id.slice(0, 8)}...`
               : ''}
             </div>
            </div>
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B]">
            ₦{parseFloat(transaction.amount).toLocaleString()}
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B]">
            <span
             className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              transaction.transactionType === 'deposit'
               ? 'bg-green-100 text-green-800'
               : 'bg-blue-100 text-blue-800',
             )}
            >
             {transaction.transactionType?.charAt(0).toUpperCase() +
              transaction.transactionType?.slice(1) || 'N/A'}
            </span>
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B]">
            <span
             className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              transaction.status === 'success'
               ? 'bg-green-100 text-green-800'
               : transaction.status === 'pending'
                 ? 'bg-yellow-100 text-yellow-800'
                 : 'bg-red-100 text-red-800',
             )}
            >
             {transaction.status?.charAt(0).toUpperCase() +
              transaction.status?.slice(1) || 'N/A'}
            </span>
           </TableCell>
           <TableCell className="py-3 pl-8 font-semibold text-base text-[#25324B]">
            {new Date(transaction.createdAt).toLocaleDateString()}
           </TableCell>
           <TableCell className="py-6 pr-14">
            <Button
             variant="outline"
             size="sm"
             className="h-8 px-3 text-xs"
             onClick={() => {
              // Navigate to transaction details
              window.location.href = `/dashboard/transactions/${transaction.id}`;
             }}
            >
             View Details
            </Button>
           </TableCell>
          </TableRow>
         ))}
        </TableBody>
       </Table>
      </div>
     )}

     {/* Pagination */}
     {!isLoading && transactions.length > 0 && (
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
      </div>
     )}

     {/* Service Configuration Tab */}
     {activeTab === 'service-config' && (
      <div className="w-full">
       <ServiceConfiguration />
      </div>
     )}
    </Tabs>
   </div>
  </div>
 );
};

export default TransactionsPage;
