import NotificationsAccordion from '@/components/notifications/Notifications';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
 const navigate = useNavigate();
 return (
  <div className="w-full px-4 md:px-10">
   <div className=" w-full pt-4 ">
    <div className="flex items-center justify-between">
     <div>
      <h2 className="text-[20px] text-gray900 font-extrabold leading-[140%]">
       Notification Management
      </h2>
      <p className="mt-1 text-sm text-gray600 leading-[140%]">
       Here is all your Kormat analytics overview
      </p>
     </div>

     <Button className="w-[174px] h-[54px] font-bold rounded-[16px] text-sm  leading-[120%] flex justify-center items-center font-outfit   " onClick={()=> navigate("/dashboard/create-notification")}>
      Create Notification
     </Button>
    </div>
   </div>

   <div className="mt-7">
    <NotificationsAccordion />
   </div>
  </div>
 );
};

export default NotificationsPage;
