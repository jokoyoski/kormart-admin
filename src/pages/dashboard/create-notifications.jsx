import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check } from 'lucide-react';
import React from 'react';
import { BiSolidChevronRight } from 'react-icons/bi';
import { HiMiniArrowRight } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

const CreateNotificationsPage = () => {
 return (
  <div className="w-full px-4 md:px-10">
   <div className=" w-full pt-4 ">
    <div>
     <h2 className="text-[20px] text-gray900 font-extrabold leading-[140%]">
      Notification Management
     </h2>
     <div className="mt-1 flex items-center gap-1.5 text-sm text-[#50555C]">
      <Link
       to="/dashboard/notifications"
       className="cursor-pointer"
      >
       Notification Management
      </Link>
      <BiSolidChevronRight />
      <span>Add Details</span>
     </div>
    </div>
   </div>

   <Card className=" cus_shadow rounded-[8px] bg-white  w-full mt-7 flex flex-col md:flex-row gap-y-6 gap-x-2.5 items-stretch">
    <div className="flex justify-center md:justify-start md:items-start min-h-full md:w-[300px] md:border-r border-[#32475C1F] p-4 md:p-6">
     <div className="flex items-center ">
      <div className="min-w-5 h-5 rounded-full bg-secondary flex justify-center items-center mr-2">
       <Check className="text-black size-3" />
      </div>
      <div className="text-[#50555C] text-[24px] md:text-[32px] leading-[140%] font-bold">
       01
      </div>
      <div className="flex flex-col ml-2 text-[#50555C]">
       <h1 className="text-sm font-bold leading-[120%] ">
        Notification Details
       </h1>
       <span className="mt-0 text-[13px] font-normal ">
        Description and type
       </span>
      </div>
     </div>
    </div>

    {/* form */}
    <form className="p-4 md:p-6 md:mt-7  w-full">
     <div className="space-y-5 w-full">
      <Input
       className="w-full h-[56px] rounded-[6px] px-3 py-3 flex items-center border-[#32475C38] placeholder:text-[#32475C61] bg-transparent"
       placeholder="Title"
      />
      <Textarea
       className="border-[#32475C38] placeholder:text-[#32475C61] w-full rounded-[6px] p-3 h-[250px] bg-transparent"
       placeholder="Description"
      />
     </div>

     <Button
      type="submit"
      className="w-full rounded-[10px] h-[50px] text-sm  leading-[140%] flex justify-center items-center gap-2 font-urbanist mt-6 shadow-[0px_1px_4px_2px_rgba(50,71,92,0.02),0px_2px_6px_1px_rgba(50,71,92,0.04)]"
     >
      <span className="font-semibold">Submit</span>
      <HiMiniArrowRight className="text-black" />
     </Button>
    </form>
   </Card>
  </div>
 );
};

export default CreateNotificationsPage;
