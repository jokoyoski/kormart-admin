import { useParams, useNavigate } from 'react-router-dom';
import { User, CreditCard, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useGetTransactionDetails } from '@/api/transactions/get-transactions';
import { cn } from '@/lib/utils';
import { DetailRow, BooleanBadge, StatusBadgeWithIcon } from '@/components/detail/DetailComponents';
import { DetailPageLayout, BackButton, ErrorState, LoadingState } from '@/components/detail/DetailLayout';
import { formatDetailCurrency, formatDetailDate } from '@/utils/format';
import { getTransactionStatusConfig } from '@/utils/statusConfigs';

const TransactionDetailsPage = () => {
 const { id } = useParams();
 const navigate = useNavigate();
 
 const { data: transactionResponse, isLoading, error } = useGetTransactionDetails(id);
 const transaction = transactionResponse?.data;

 if (error) {
  return (
   <ErrorState
    title="Transaction Not Found"
    message="The transaction you're looking for doesn't exist or has been removed."
    backButtonLabel="Back to Transactions"
    onBack={() => navigate('/dashboard/transactions')}
   />
  );
 }

 return (
  <DetailPageLayout>
    {/* Header */}
    <BackButton onClick={() => navigate('/dashboard/transactions')} />

    {isLoading ? (
     <LoadingState />
    ) : transaction ? (
     <div className="space-y-4">
      {/* Transaction Amount Hero Card */}
      <Card className={cn(
       "p-8 border-2",
       transaction.transactionType === 'withdrawal' 
        ? 'bg-gradient-to-br from-error50 to-white border-error/20' 
        : 'bg-gradient-to-br from-success50 to-white border-success/20'
      )}>
       <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
         <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          transaction.transactionType === 'withdrawal' ? 'bg-error/10' : 'bg-success/10'
         )}>
          {transaction.transactionType === 'withdrawal' ? (
           <ArrowUpRight className={cn("w-6 h-6", "text-error")} />
          ) : (
           <ArrowDownLeft className={cn("w-6 h-6", "text-success")} />
          )}
         </div>
         <div>
          <p className="text-sm text-gray600 mb-1">
           {transaction.transactionType === 'withdrawal' ? 'Payment Sent' : 'Funds Received'}
          </p>
          <h2 className="text-3xl font-bold text-gray900">
           {transaction.transactionType === 'withdrawal' ? '-' : '+'}{formatDetailCurrency(transaction.amount)}
          </h2>
         </div>
        </div>
        
        <StatusBadgeWithIcon 
         status={transaction.status} 
         config={getTransactionStatusConfig(transaction.status)} 
        />
       </div>
       
       <div className="space-y-2">
        {transaction.narration && (
         <p className="text-sm text-gray700">{transaction.narration}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-gray600">
         <span className="font-mono">{transaction.transactionReference}</span>
         {transaction.orderId && (
          <>
           <span>•</span>
           <span>Order ID: {transaction.orderId}</span>
          </>
         )}
        </div>
       </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
       {/* Transaction Information */}
       <Card className="p-6">
        <h3 className="text-base font-semibold text-gray900 mb-4 flex items-center gap-2">
         <CreditCard className="w-5 h-5 text-primary" />
         Transaction Details
        </h3>
        <div className="space-y-1">
         <DetailRow label="Transaction ID" value={transaction.transactionID} mono />
         <DetailRow label="Reference" value={transaction.transactionReference} mono />
         <DetailRow label="Type" value={transaction.transactionType?.toUpperCase()} />
         <DetailRow label="Amount" value={formatDetailCurrency(transaction.amount)} />
         <DetailRow label="Created" value={formatDetailDate(transaction.createdAt)} />
         <DetailRow label="Updated" value={formatDetailDate(transaction.updatedAt)} />
        </div>
       </Card>

       {/* User Information */}
       <Card className="p-6">
        <h3 className="text-base font-semibold text-gray900 mb-4 flex items-center gap-2">
         <User className="w-5 h-5 text-primary" />
         User Information
        </h3>
        <div className="space-y-1">
         <DetailRow label="Full Name" value={transaction.user?.userDetails?.fullName} />
         <DetailRow label="Username" value={transaction.user?.userDetails?.username} />
         <DetailRow label="Email" value={transaction.user?.email} />
         <DetailRow label="Phone" value={transaction.user?.userDetails?.telephone} />
         <BooleanBadge label="Active" value={transaction.user?.isActive} />
         <BooleanBadge label="Verified" value={transaction.user?.isVerified} />
         <BooleanBadge label="Wallet Activated" value={transaction.user?.isWalletActivated} />
        </div>
       </Card>

       {/* From Account */}
       <Card className="p-6">
        <h3 className="text-base font-semibold text-gray900 mb-4">
         From (Sender)
        </h3>
        <div className="space-y-1">
         <DetailRow label="Account Name" value={transaction.senderName} />
         <DetailRow label="Account Number" value={transaction.senderAccountNumber} mono />
         {transaction.senderBankName && (
          <DetailRow label="Bank Name" value={transaction.senderBankName} />
         )}
        </div>
       </Card>

       {/* To Account */}
       <Card className="p-6">
        <h3 className="text-base font-semibold text-gray900 mb-4">
         To (Recipient)
        </h3>
        <div className="space-y-1">
         <DetailRow label="Account Name" value={transaction.receiverName} />
         <DetailRow label="Account Number" value={transaction.receiverAccountNumber} mono />
         {transaction.receiverBankName && (
          <DetailRow label="Bank Name" value={transaction.receiverBankName} />
         )}
        </div>
       </Card>
      </div>
     </div>
    ) : null}
  </DetailPageLayout>
 );
};

export default TransactionDetailsPage;