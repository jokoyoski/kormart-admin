import { cn } from '@/lib/utils';

const Logo = ({ className = '' }) => {
 return (
  <img
   src="/logo.png"
   alt="Kormat"
   className={cn('w-[115px] h-[38px] object-contain', className)}
  />
 );
};

export default Logo;
