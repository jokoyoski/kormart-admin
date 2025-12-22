import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(
 (
  {
   className,
   variant = 'default',
   size = 'default',
   isLoading = false,
   disabled,
   shadow,
   children,
   ...props
  },
  ref,
 ) => {
  return (
   <button
    ref={ref}
    disabled={disabled || isLoading}
    className={cn(
     // Base styles
     'inline-flex items-center justify-center rounded-md font-medium transition-colors',
     'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
     'disabled:pointer-events-none disabled:opacity-50',

     // Variants
     variant === 'default' &&
      'bg-secondary text-black hover:bg-secondary/90',
     variant === 'destructive' &&
      'bg-destructive text-destructive-foreground hover:bg-destructive/90',
     variant === 'outline' &&
      'border border-blue100 bg-transparent text-blue100 hover:bgaccent hover:text-acc=ent-foreground',
     variant === 'secondary' &&
      'bg-secondary text-secondary-foreground hover:bg-secondary/80',
     variant === 'ghost' &&
      'hover:bg-accent hover:text-accent-foreground',
     variant === 'link' &&
      'text-primary underline-offset-4 hover:underline',

     // Sizes
     size === 'default' && 'h-10 px-4 py-2',
     size === 'sm' && 'h-9 rounded-md px-3',
     size === 'lg' && 'h-11 rounded-md px-8',
     size === 'icon' && 'h-10 w-10',

     // shadow
     shadow && 'shadow-figma',

     className,
    )}
    {...props}
   >
    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    {children}
   </button>
  );
 },
);

Button.displayName = 'Button';

export default Button;
