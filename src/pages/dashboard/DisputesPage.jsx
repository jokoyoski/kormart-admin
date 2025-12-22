'use client';

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SmsVg1 from '@/assets/icons/SmsVg1';
import SmsVg2 from '@/assets/icons/SmsVg2';
import SmsVg3 from '@/assets/icons/SmsVg3';
import SmsVg4 from '@/assets/icons/SmsVg4';
import { cn } from '@/lib/utils';
import { useGetAllDisputes } from '@/api/disputes/get-disputes';

import Loading from '@/components/Loading';
import { formatDate, formatCurrency } from '@/utils/format';
import {
 getUserName,
 getUserInitials,
 getUserAvatar,
} from '@/utils/user';
import { getDisputeStatusConfig } from '@/utils/statusConfigs';
import {
 Avatar,
 AvatarFallback,
 AvatarImage,
} from '@/components/ui/avatar';

const DisputesPage = () => {
 const navigate = useNavigate();
 const [activeTab, setActiveTab] = useState('all');
 const [searchQuery, setSearchQuery] = useState('');
 const [currentPage, setCurrentPage] = useState(0);
 const [limit] = useState(20);

 const getApiStatus = (uiStatus) => {
  if (uiStatus === 'all') return null;
  return uiStatus;
 };

 const queryParams = useMemo(() => {
  const params = {
   page: currentPage,
   limit,
   ...(searchQuery && { search: searchQuery }),
  };

  if (activeTab !== 'all') {
   params.status = getApiStatus(activeTab);
  }

  return params;
 }, [currentPage, limit, searchQuery, activeTab]);

 const { data, isLoading, error } = useGetAllDisputes(queryParams);

 const disputes = data?.data || [];
 const meta = data?.meta || {};

 useEffect(() => {
  const timer = setTimeout(() => {
   setCurrentPage(0);
  }, 500);

  return () => clearTimeout(timer);
 }, [searchQuery]);

 const handleTabChange = (value) => {
  setActiveTab(value);
  setCurrentPage(0);
 };

 const handleOpenTicket = (ticketId) => {
  navigate(`/dashboard/disputes/${ticketId}`);
 };

 return (
  <div className="w-full px-4 md:px-10 pt-4">
   {/* Header */}
   <div className="mb-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-2">
     Disputes & support
    </h1>
    <p className="text-gray-600">
     Here is all your Kormat analytics overview
    </p>
   </div>

   <Card className="shadow-none rounded-[8px] bg-white p-4 w-full">
    {/* Search */}
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
     <div className="relative flex-1 max-w-[400px]">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
       placeholder="Search for ticket"
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
       className="pl-10 bg-[#FBFBFB] border-[#E7E7E7]"
      />
     </div>
    </div>

    {/* Tabs */}
    <Tabs
     value={activeTab}
     onValueChange={handleTabChange}
     className="w-full"
    >
     <TabsList className="mb-6 justify-start bg-transparent !h-fit items-center border-b border-[#E7E7E7] !p-0 gap-10 md:gap-20 overflow-x-auto w-full rounded-none">
      {[
       { key: 'all', label: 'All', icon: SmsVg1 },
       { key: 'pending', label: 'Pending', icon: SmsVg2 },
       { key: 'ongoing', label: 'On-Going', icon: SmsVg3 },
       { key: 'resolved', label: 'Resolved', icon: SmsVg4 },
      ].map(({ key, label, icon: Icon }) => (
       <TabsTrigger
        key={key}
        value={key}
        className="pb-3 !px-0 !w-fit !h-full data-[state=active]:border-b-[3px] data-[state=active]:border-primary data-[state=active]:!text-primary data-[state=active]:font-regular data-[state=active]:font-outfit font-outfit rounded-none bg-transparent font-regular leading-[140%] text-sm flex gap-2 text-[#646464]"
       >
        <Icon
         className={cn(
          '',
          activeTab == key ? 'stroke-primary' : 'stroke-[#646464]',
         )}
        />
        <span>{label}</span>
       </TabsTrigger>
      ))}
     </TabsList>
    </Tabs>

    <div>
     {isLoading ? (
      <div className="w-full mt-4 h-[300px] flex justify-center items-center">
       <Loading />
      </div>
     ) : error ? (
      <div className="w-full mt-4 h-[300px] flex justify-center items-center">
       <h3 className="text-xl font-medium text-red-500">
        Error loading disputes. Please try again.
       </h3>
      </div>
     ) : disputes && disputes.length > 0 ? (
      <div className="border border-[#E7E7E7] rounded-lg overflow-hidden">
       {/* Table Header */}
       <div className="hidden md:grid md:grid-cols-[1fr_120px_140px_100px_150px_40px] bg-[#FAFAFA] px-4 py-3 text-xs font-medium text-[#646464] uppercase tracking-wide border-b border-[#E7E7E7]">
        <span>Dispute</span>
        <span>Status</span>
        <span>Amount</span>
        <span>Product</span>
        <span>Parties</span>
        <span></span>
       </div>

       {/* Dispute Rows */}
       <div className="divide-y divide-[#E7E7E7]">
        {disputes.map((dispute) => {
         const buyer = dispute?.order?.buyer;
         const seller = dispute?.order?.seller;
         const product = dispute?.order?.product;
         const order = dispute?.order;
         const statusConfig = getDisputeStatusConfig(dispute.status);

         return (
          <div
           key={dispute.id}
           className="group bg-white hover:bg-[#FAFAFA] transition-colors cursor-pointer"
           onClick={() => handleOpenTicket(dispute.id)}
          >
           {/* Desktop Row */}
           <div className="hidden md:grid md:grid-cols-[1fr_120px_140px_100px_150px_40px] items-center px-4 py-3 gap-2">
            {/* Dispute Info */}
            <div className="min-w-0">
             <p className="text-sm font-semibold text-[#1A1A1A] truncate mb-0.5">
              {dispute.reason || 'Dispute'}
             </p>
             <p className="text-xs text-[#939393]">
              #{dispute.ticketNumber} ·{' '}
              {formatDate(dispute.createdAt)}
             </p>
            </div>

            {/* Status Badge */}
            <div>
             <span
              className={cn(
               'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
               statusConfig.bg,
               statusConfig.color,
              )}
             >
              <span
               className={cn(
                'w-1.5 h-1.5 rounded-full',
                dispute.status === 'pending' && 'bg-amber-500',
                dispute.status === 'ongoing' && 'bg-blue-500',
                dispute.status === 'resolved' && 'bg-green-500',
               )}
              />
              {statusConfig.label}
             </span>
            </div>

            {/* Amount */}
            <div className="text-sm font-semibold text-[#1A1A1A]">
             {order?.agreedPrice
              ? formatCurrency(order.agreedPrice)
              : '—'}
            </div>

            {/* Product */}
            <div className="text-sm text-[#646464] truncate">
             {product?.name || '—'}
            </div>

            {/* Parties - Stacked Avatars */}
            <div className="flex items-center">
             <div className="flex -space-x-2">
              {buyer && (
               <Avatar className="h-7 w-7 border-2 border-white">
                <AvatarImage
                 src={getUserAvatar(buyer) || '/placeholder.svg'}
                />
                <AvatarFallback className="text-[9px] bg-blue-50 text-blue-600">
                 {getUserInitials(buyer)}
                </AvatarFallback>
               </Avatar>
              )}
              {seller && (
               <Avatar className="h-7 w-7 border-2 border-white">
                <AvatarImage
                 src={getUserAvatar(seller) || '/placeholder.svg'}
                />
                <AvatarFallback className="text-[9px] bg-orange-50 text-orange-600">
                 {getUserInitials(seller)}
                </AvatarFallback>
               </Avatar>
              )}
             </div>
             <span className="ml-2 text-xs text-[#939393] truncate">
              {buyer && seller
               ? `${getUserName(buyer).split(' ')[0]} vs ${getUserName(seller).split(' ')[0]}`
               : buyer
                 ? getUserName(buyer)
                 : '—'}
             </span>
            </div>

            {/* Arrow */}
            <div className="flex justify-end">
             <ChevronRight className="h-4 w-4 text-[#C4C4C4] group-hover:text-primary transition-colors" />
            </div>
           </div>

           {/* Mobile Card */}
           <div className="md:hidden p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
             <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
               {dispute.reason || 'Dispute'}
              </p>
              <p className="text-xs text-[#939393]">
               #{dispute.ticketNumber} ·{' '}
               {formatDate(dispute.createdAt)}
              </p>
             </div>
             <span
              className={cn(
               'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0',
               statusConfig.bg,
               statusConfig.color,
              )}
             >
              <span
               className={cn(
                'w-1.5 h-1.5 rounded-full',
                dispute.status === 'pending' && 'bg-amber-500',
                dispute.status === 'ongoing' && 'bg-blue-500',
                dispute.status === 'resolved' && 'bg-green-500',
               )}
              />
              {statusConfig.label}
             </span>
            </div>

            <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
               {buyer && (
                <Avatar className="h-6 w-6 border-2 border-white">
                 <AvatarImage
                  src={getUserAvatar(buyer) || '/placeholder.svg'}
                 />
                 <AvatarFallback className="text-[8px] bg-blue-50 text-blue-600">
                  {getUserInitials(buyer)}
                 </AvatarFallback>
                </Avatar>
               )}
               {seller && (
                <Avatar className="h-6 w-6 border-2 border-white">
                 <AvatarImage
                  src={getUserAvatar(seller) || '/placeholder.svg'}
                 />
                 <AvatarFallback className="text-[8px] bg-orange-50 text-orange-600">
                  {getUserInitials(seller)}
                 </AvatarFallback>
                </Avatar>
               )}
              </div>
              <span className="text-sm font-semibold text-[#1A1A1A]">
               {order?.agreedPrice
                ? formatCurrency(order.agreedPrice)
                : '—'}
              </span>
             </div>
             <ChevronRight className="h-4 w-4 text-[#C4C4C4]" />
            </div>
           </div>
          </div>
         );
        })}
       </div>
      </div>
     ) : (
      <div className="w-full mt-4 h-[300px] flex justify-center items-center">
       <h3 className="text-xl font-medium">No tickets found</h3>
      </div>
     )}

     {/* Pagination */}
     {meta.totalPages > 1 && (
      <div className="flex justify-center items-center gap-2 mt-6">
       <button
        onClick={() =>
         setCurrentPage((prev) => Math.max(0, prev - 1))
        }
        disabled={currentPage === 0}
        className="px-4 py-2 border border-[#E7E7E7] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors"
       >
        Previous
       </button>
       <span className="text-sm text-[#939393]">
        Page {meta.currentPage} of {meta.totalPages}
       </span>
       <button
        onClick={() =>
         setCurrentPage((prev) =>
          Math.min(meta.totalPages - 1, prev + 1),
         )
        }
        disabled={currentPage >= meta.totalPages - 1}
        className="px-4 py-2 border border-[#E7E7E7] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors"
       >
        Next
       </button>
      </div>
     )}
    </div>
   </Card>
  </div>
 );
};

export default DisputesPage;
