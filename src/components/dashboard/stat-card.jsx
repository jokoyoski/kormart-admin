import { cn } from '@/lib/utils';

const StatCard = ({ title, value, icon: Icon }) => {
 return (
  <div
   className={cn(
    'flex items-center py-4 md:py-0 md:h-[97px]  bg-white rounded-[8px]',
    Icon ? 'px-4' : 'px-[30px]',
   )}
  >
   {Icon && (
    <div className="mr-4 size-[56px] rounded-full bg-[#F4F7FE] flex items-center justify-center">
     <Icon className="size-6 text-primary" />
    </div>
   )}
   <div>
    <h3 className="text-sm text-[#AEB3BE] font-medium leading-[140%]">
     {title}
    </h3>
    <p className="text-primary text-[23px] leading-[140%] font-bold">
     {value}
    </p>
   </div>
  </div>
 );
};

export default StatCard;
