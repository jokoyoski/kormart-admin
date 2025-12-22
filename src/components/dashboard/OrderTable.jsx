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
import { useGetAllTransactions } from '@/api/transactions/get-transactions';
import { Skeleton } from '../ui/skeleton';

const DashboardOrderTable = () => {
 const navigate = useNavigate();
 
 // Fetch recent transactions (limit 10, no pagination)
 const { data: transactionsResponse, isLoading } = useGetAllTransactions({
  limit: 10
 });
 
 const transactions = transactionsResponse?.data || [];

 // Table columns for transactions
 const transactionsColumns = [
  {
   header: 'NO',
   accessor: 'index',
   enableSorting: false,
   cell: (info) => {
    return <span>{info.row.index + 1}</span>;
   },
  },

  {
   header: 'Transaction ID',
   accessor: 'transactionID',
   enableSorting: false,
   cell: (info) => {
    const transaction = info.row.original;
    const id = transaction.transactionID || transaction.transactionReference;
    return <span className="block min-w-[150px] font-mono text-sm">{id}</span>;
   },
  },
  {
   header: 'User',
   accessor: 'user',
   enableSorting: false,
   cell: (info) => {
    const transaction = info.row.original;
    return (
     <div>
      <div className="font-medium">{transaction.user?.email || 'N/A'}</div>
      <div className="text-xs text-gray-500">
       {transaction.user?.id ? `ID: ${transaction.user.id.slice(0, 8)}...` : ''}
      </div>
     </div>
    );
   },
  },

  {
   header: 'Amount',
   accessor: 'amount',
   enableSorting: false,
   cell: (info) => {
    const amount = parseFloat(info.getValue() || 0);
    return <span className="font-semibold">₦{amount.toLocaleString()}</span>;
   },
  },
  {
   header: 'Type',
   accessor: 'transactionType',
   enableSorting: false,
   cell: (info) => {
    const type = info.getValue();
    return (
     <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      type === 'deposit' 
       ? 'bg-green-100 text-green-800'
       : 'bg-blue-100 text-blue-800'
     )}>
      {type?.charAt(0).toUpperCase() + type?.slice(1) || 'N/A'}
     </span>
    );
   },
  },

  {
   header: 'Status',
   accessor: 'status',
   enableSorting: false,
   cell: (info) => {
    const status = info.getValue();
    return (
     <div
      className={cn(
       'w-[80px] h-[30px] rounded-[130px] text-sm font-semibold leading-[140%] flex items-center justify-center',
       status === 'success' && 'bg-green-100 text-green-800',
       status === 'pending' && 'bg-yellow-100 text-yellow-800',
       status === 'failed' && 'bg-red-100 text-red-800',
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
    const transaction = info.row.original;

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
         navigate(`/dashboard/transactions/${transaction.id}`);
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
  <Card className=" shadow-none rounded-[8px] bg-white pb-4 w-full mt-6">
   <div className="flex items-center justify-between px-4 py-8">
    <h2 className="font-outfit text-[#2B3674] text-[18px] font-extrabold leading-[140%]">
     Recent Transactions
    </h2>
    <button
     onClick={() => navigate('/dashboard/transactions')}
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
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-6" />
       </div>
      ))}
     </div>
    ) : transactions.length === 0 ? (
     <div className="px-4 pb-4 text-center py-8">
      <p className="text-gray-500">No recent transactions</p>
     </div>
    ) : (
     <DataTable
      tableColumns={transactionsColumns}
      tableData={transactions}
      enableGlobalFilter={false}
      enablePagination={false}
      showPagination={false}
      showSearch={false}
      emptyHeading="No transactions found"
      emptySubtitle="There are no transactions to display."
      loading={false}
      serverSidePagination={false}
      manualPagination={false}
     />
    )}
   </div>
  </Card>
 );
};

export default DashboardOrderTable;
