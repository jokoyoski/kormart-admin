import {
 Sheet,
 SheetContent,
 SheetClose,
 SheetOverlay,
 SheetTitle,
 SheetDescription,
} from '@/components/ui/sheet';
import { MdOutlineClose } from 'react-icons/md';
import { cn } from '@/lib/utils';

export default function OrderDetailsSheet({
 open,
 onOpenChange,
 order = [],
}) {
 const status = order?.status;
 return (
  <Sheet
   open={open}
   onOpenChange={onOpenChange}
   className="w-full"
  >
   <SheetOverlay className="bg-transparent" />
   <SheetContent
    side="right"
    className="w-full sm:max-w-[623px] p-0 py-3 bg-white rounded-[20px] border-0"
   >
    <div className="hidden">
     <SheetTitle>Order Details</SheetTitle>
     <SheetDescription>{order?.no}</SheetDescription>
    </div>
    {/* header */}
    <div className="px-4 md:px-6 flex items-center justify-between py-4 border-b-[0.5px] border-[#D3D3D3]">
     <h2 className="text-black font-bold leading-[140%] ">
      {`Order ${order?.no ?? '001'}`}
     </h2>

     <SheetClose>
      <div className="cursor-pointer flex justify-center items-center size-[30px] rounded-[6px] border-[1.5px] border-black">
       <MdOutlineClose className="size-4 text-black" />
       <span className="sr-only">Close</span>
      </div>
     </SheetClose>
    </div>

    <div className="w-full px-4 md:px-[26px] pt-8 md:pt-10 pb-20 overflow-y-auto h-full">
     {/* details */}
     <div className="border-[0.5px] border-[#D3D3D3] rounded-[10px] overflow-hidden ">
      <KeyValue
       name={'Date Created:'}
       value={order?.dateCreated}
      />
      <KeyValue
       name={'Time:'}
       value={'12:00 PM'}
      />
      <KeyValue
       name={'Customer:'}
       value={order?.customer}
      />

      <KeyValue
       name={'Seller:'}
       value={order?.customer}
      />

      <div className="flex items-center justify-between py-[20px] px-4 border-[0.5px] border-[#D3D3D3]">
       <span className="text-[#3F3F3F] text-[18px] font-medium">
        Order Status
       </span>
       <span
        className={cn(
         ' font-semibold  w-[93px] h-[32px] rounded-[130px]   flex items-center justify-center',

         status === 'Ongoing' && 'bg-primary50 text-primary500',
         status === 'Cancelled' && 'bg-primary50 text-error ',
         status === 'Delivered' && 'bg-success50 text-success',
        )}
       >
        {status}
       </span>
      </div>

      <KeyValue
       name={'Payment Status:'}
       value={'Pending'}
      />
      <KeyValue
       name={'Delivery Status:'}
       value={'Not Delivered'}
      />
     </div>

     {/* location */}
     <div className="border-[0.5px] border-[#D3D3D3] rounded-[10px] overflow-hidden mt-10 mb-[50px] py-[20px] px-4 flex justify-between items-center gap-4">
      <div className="p-2 flex justify-center items-center size-[65px] rounded-[10px] bg-[#EBEEFF]">
       <img
        src="/assets/map.png"
        alt="map image"
        className="size-[50px] rounded-[10px]"
       />
      </div>
      <div className="flex-1 flex items-center justify-between">
       <div>
        <h3 className="text-[22px] font-bold text-black">Alimosho</h3>
        <p className="text-[18px] font-medium">
         No, 79, Marvin Gerrad ,....{' '}
        </p>
       </div>

       <div className="py-2 px-[13px] rounded-[20px] border border-[#AEB3BE] flex justify-center items-center cursor-pointer md:text-[18px] font-medium ">
        Copy Location
       </div>
      </div>
     </div>

     {/* items breakdown */}
     <div className="border-[0.5px] border-[#D3D3D3] rounded-[10px] overflow-hidden ">
      <div className="flex items-center py-[20px] px-4 border-[0.5px] border-[#D3D3D3]">
       <span className="text-[#3F3F3F] text-[22px] font-semibold">
        Items Breakdown
       </span>
      </div>
      <KeyValue
       name={'Frozen Chicken'}
       value={2}
      />
      <KeyValue
       name={'Agreed Price'}
       value={'#10,000'}
      />
     </div>
    </div>
   </SheetContent>
  </Sheet>
 );
}

const KeyValue = ({ name, value }) => (
 <div className="flex justify-between items-center py-[20px] px-4 border-[0.5px] border-[#D3D3D3]">
  <span className="text-[#3F3F3F] text-[18px] font-medium">
   {name}
  </span>
  <span className="text-black text-[18px] font-semibold text-right">
   {value}
  </span>
 </div>
);
