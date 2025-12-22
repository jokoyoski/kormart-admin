import OrderTable from '@/components/orders/OrdersTable';

const OrdersPage = () => {
 return (
  <div className="w-full px-4 md:px-10">
   <div className=" w-full pt-4 ">
    <div>
     <h2 className="text-[20px] text-gray900 font-extrabold leading-[140%]">
      Order
     </h2>
     <p className="mt-1 text-sm text-gray600 leading-[140%]">
      Here is all your Orders analytics overview
     </p>
    </div>
   </div>
   <OrderTable />
  </div>
 );
};

export default OrdersPage;
