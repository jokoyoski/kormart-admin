import { useParams, useNavigate } from 'react-router-dom';
import { Package, User, ShoppingBag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useGetOrderDetails } from '@/api/orders/get-orders';
import { cn } from '@/lib/utils';
import {
 DetailRow,
 BooleanBadge,
 StatusBadge,
 StatusBadgeWithIcon,
} from '@/components/detail/DetailComponents';
import {
 DetailPageLayout,
 BackButton,
 ErrorState,
 LoadingState,
} from '@/components/detail/DetailLayout';
import {
 formatDetailCurrency,
 formatDetailDate,
} from '@/utils/format';
import {
 getOrderStatusConfig,
 getPaymentStatusConfig,
} from '@/utils/statusConfigs';

const OrderDetailsPage = () => {
 const { id } = useParams();
 const navigate = useNavigate();

 const {
  data: orderResponse,
  isLoading,
  error,
 } = useGetOrderDetails(id);
 const order = orderResponse?.data;

 if (error) {
  return (
   <ErrorState
    title="Order Not Found"
    message="The order you're looking for doesn't exist or has been removed."
    backButtonLabel="Back to Orders"
    onBack={() => navigate('/dashboard/orders')}
   />
  );
 }

 return (
  <DetailPageLayout>
   {/* Header */}
   <BackButton onClick={() => navigate('/dashboard/orders')} />

   {isLoading ? (
    <LoadingState />
   ) : order ? (
    <div className="space-y-4">
     {/* Order Hero Card */}
     <Card className="p-8 bg-gradient-to-br from-primary50 to-white border-2 border-primary/20">
      <div className="flex items-center justify-between mb-4">
       <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
         <ShoppingBag className="w-6 h-6 text-primary" />
        </div>
        <div>
         <p className="text-sm text-gray600 mb-1">Order Amount</p>
         <h2 className="text-3xl font-bold text-gray900">
          {formatDetailCurrency(order.agreedPrice)}
         </h2>
        </div>
       </div>

       <div className="flex flex-col gap-2 items-end">
        <StatusBadgeWithIcon
         status={order.orderStatus}
         config={getOrderStatusConfig(order.orderStatus)}
        />
        <StatusBadge
         status={order.paymentStatus}
         config={getPaymentStatusConfig(order.paymentStatus)}
        />
       </div>
      </div>

      <div className="space-y-2">
       {order.product?.description && (
        <p className="text-sm text-gray700">
         {order.product.description}
        </p>
       )}
       <div className="flex items-center gap-4 text-xs text-gray600">
        <span className="font-mono">{order.orderId || order.id}</span>
        {order.transactionReference && (
         <>
          <span>•</span>
          <span>Ref: {order.transactionReference}</span>
         </>
        )}
       </div>
      </div>
     </Card>

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Order Information */}
      <Card className="p-6">
       <h3 className="text-base font-semibold text-gray900 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-primary" />
        Order Details
       </h3>
       <div className="space-y-1">
        <DetailRow
         label="Order ID"
         value={order.orderId}
         mono
        />
        <DetailRow
         label="Agreed Price"
         value={formatDetailCurrency(order.agreedPrice)}
        />
        {order.product?.price && (
         <DetailRow
          label="Original Price"
          value={formatDetailCurrency(order.product.price)}
         />
        )}
        <div className="flex items-center justify-between py-2.5 border-b border-gray100 last:border-0">
         <span className="text-sm text-gray600">Order Status</span>
         <StatusBadge
          status={order.orderStatus}
          config={getOrderStatusConfig(order.orderStatus)}
         />
        </div>
        <div className="flex items-center justify-between py-2.5 border-b border-gray100 last:border-0">
         <span className="text-sm text-gray600">Payment Status</span>
         <StatusBadge
          status={order.paymentStatus}
          config={getPaymentStatusConfig(order.paymentStatus)}
         />
        </div>
        <DetailRow
         label="Created"
         value={formatDetailDate(order.createdAt)}
        />
        <DetailRow
         label="Updated"
         value={formatDetailDate(order.updatedAt)}
        />
       </div>
      </Card>

      {/* Product Information */}
      {order.product && (
       <Card className="p-6">
        <h3 className="text-base font-semibold text-gray900 mb-4 flex items-center gap-2">
         <Package className="w-5 h-5 text-primary" />
         Product Details
        </h3>
        <div className="space-y-1">
         <DetailRow
          label="Product Name"
          value={order.product.name}
         />
         <DetailRow
          label="Price"
          value={formatDetailCurrency(order.product.price)}
         />
         <BooleanBadge
          label="Negotiable"
          value={order.product.isNegotiable}
         />
         <div className="flex items-center justify-between py-2.5 border-b border-gray100 last:border-0">
          <span className="text-sm text-gray600">Status</span>
          <span
           className={cn(
            'px-2.5 py-1 rounded-full text-xs font-medium',
            order.product.isSold
             ? 'bg-error50 text-error'
             : 'bg-success50 text-success',
           )}
          >
           {order.product.isSold ? 'Sold' : 'Available'}
          </span>
         </div>
         <DetailRow
          label="State"
          value={order.product.state}
         />
         <DetailRow
          label="Phone"
          value={order.product.telephone}
         />
         {order.product.address && (
          <div className="pt-2 border-t border-gray100">
           <span className="text-sm text-gray600 block mb-1">
            Address
           </span>
           <span className="text-sm text-gray900 font-medium">
            {order.product.address}
           </span>
          </div>
         )}
        </div>
       </Card>
      )}

      {/* Buyer Information */}
      {order.buyer && (
       <Card className="p-6">
        <h3 className="text-base font-semibold text-gray900 mb-4 flex items-center gap-2">
         <User className="w-5 h-5 text-primary" />
         Buyer Information
        </h3>
        <div className="space-y-1">
         <DetailRow
          label="Full Name"
          value={order.buyer.userDetails?.fullName}
         />
         <DetailRow
          label="Username"
          value={order.buyer.userDetails?.username}
         />
         <DetailRow
          label="Email"
          value={order.buyer.email}
         />
         <DetailRow
          label="Phone"
          value={order.buyer.userDetails?.telephone}
         />
         <BooleanBadge
          label="Active"
          value={order.buyer.isActive}
         />
         <BooleanBadge
          label="Verified"
          value={order.buyer.isVerified}
         />
        </div>
       </Card>
      )}

      {/* Seller Information */}
      {order.seller && (
       <Card className="p-6">
        <h3 className="text-base font-semibold text-gray900 mb-4 flex items-center gap-2">
         <User className="w-5 h-5 text-primary" />
         Seller Information
        </h3>
        <div className="space-y-1">
         <DetailRow
          label="Full Name"
          value={order.seller.userDetails?.fullName}
         />
         <DetailRow
          label="Username"
          value={order.seller.userDetails?.username}
         />
         <DetailRow
          label="Email"
          value={order.seller.email}
         />
         <DetailRow
          label="Phone"
          value={order.seller.userDetails?.telephone}
         />
         <BooleanBadge
          label="Active"
          value={order.seller.isActive}
         />
         <BooleanBadge
          label="Verified"
          value={order.seller.isVerified}
         />
        </div>
       </Card>
      )}

      {/* Delivery Information */}
      {(order?.deliveryInformation ||
       order?.deliveryProofDocuments?.length > 0) && (
       <Card className="p-6 lg:col-span-2">
        <h3 className="text-base font-semibold text-gray900 mb-4 flex items-center gap-2">
         <User className="w-5 h-5 text-primary" />
         Delivery Information
        </h3>
        <div className="space-y-1">
         {order?.deliveryInformation && (
          <DetailRow
           label="Delivery Information"
           value={order.deliveryInformation}
          />
         )}

         {order?.deliveryProofDocuments &&
          order?.deliveryProofDocuments?.length > 0 && (
           <div className="flex items-center justify-between py-2.5 border-b border-gray100 last:border-0">
            <span className="text-sm text-gray600">
             Delivery Proof Documents
            </span>
            <div className="flex flex-col gap-2 items-end max-w-[60%]">
             {order.deliveryProofDocuments.map((docUrl, index) => (
              <button
               key={index}
               onClick={() =>
                window.open(docUrl, '_blank', 'noopener,noreferrer')
               }
               className="text-sm text-gray900 font-medium hover:text-primary transition-colors"
              >
               View Document{' '}
               {order.deliveryProofDocuments.length > 1
                ? `${index + 1}`
                : ''}
              </button>
             ))}
            </div>
           </div>
          )}
        </div>
       </Card>
      )}
     </div>
    </div>
   ) : null}
  </DetailPageLayout>
 );
};

export default OrderDetailsPage;
