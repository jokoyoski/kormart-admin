import { cn } from '@/lib/utils';
import { useState } from 'react';
import { MdOutlineDelete } from 'react-icons/md';
import { BiSolidChevronDown } from 'react-icons/bi';
const NotificationsAccordion = () => {
 const [openSection, setOpenSection] = useState(null);

 const toggleSection = (index) => {
  setOpenSection(openSection === index ? null : index);
 };

 const notifications = [
  {
   title: 'You have received a new amazing offer from Kormat!',
   content:
    'We accept Visa®, MasterCard®, American Express®, and PayPal®. Our servers encrypt all information submitted to them, so you can be confident that your credit card information will be kept safe and secure. Payment is taken during the checkout process when you pay for your order. The order number that appears on the confirmation screen indicates payment has been successfully processed.',
  },
  {
   title: 'You have received a new amazing offer from Kormat!',
   content: null,
  },
  {
   title: 'You have received a new amazing offer from Kormat!',
   content: null,
  },
 ];

 return (
  <div className="w-full space-y-5">
   {notifications.map((notification, index) => (
    <div
     key={index}
     className="bg-white  rounded-[6px] overflow-hidden shadow-[0px_1px_4px_2px_rgba(50,71,92,0.02),0px_2px_6px_1px_rgba(50,71,92,0.04)]"
    >
     <button
      onClick={() => toggleSection(index)}
      className={cn(
       'w-full flex h-[61px]  items-center justify-between  px-4 md:px-5 text-left  transition-colors cursor-pointer',
       openSection === index
        ? 'bg-transparent'
        : 'bg-[#32475C1F] hover:bg-[#32475c10]',
      )}
     >
      <span className="text-[#50555C] font-semibold">
       {notification.title}
      </span>
      <BiSolidChevronDown
       className={`w-5 h-5 text-[#50555C] transform transition-transform duration-200 ${openSection === index ? 'rotate-180' : ''}`}
      />
     </button>

     {openSection === index && (
      <div className="px-4 md:px-5 pb-2">
       <div className="pb-5 text-[#939393]">
        {notification.content || (
         <p className="">
          This is placeholder content for the notification. You can
          customize this with your actual offer details and
          information.
         </p>
        )}
       </div>
       <div className="size-10 rounded-[6px] bg-[#FF4D491F] flex justify-center items-center">
        <MdOutlineDelete className="size-6 text-[#FF3E1D]" />
       </div>
      </div>
     )}
    </div>
   ))}
  </div>
 );
};

export default NotificationsAccordion;
