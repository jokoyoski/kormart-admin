import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const FormInput2 = ({
 label,
 name,
 type = 'text',
 placeholder,
 register,
 errors,
 className,
 showPasswordToggle = false,
 ...props
}) => {
 const [showPassword, setShowPassword] = useState(false);

 const inputType = showPassword ? 'text' : type;
 const error = errors?.[name];

 // Get the register object with added event handlers
 const registerWithEvents = {
  ...register(name),
  onFocus: (e) => {
   if (register(name).onFocus) register(name).onFocus(e);
  },
  onBlur: (e) => {
   if (register(name).onBlur) register(name).onBlur(e);
  },
  onChange: (e) => {
   if (register(name).onChange) register(name).onChange(e);
  },
 };
 // console.log("registerWithEvents", registerWithEvents)
 return (
  <div className={cn('w-full space-y-1.5 pt-1', className)}>
   {label && (
    <label
     htmlFor={name}
     className={cn('text-text-primary font-semibold leading-[140%]')}
 

    >
     {label}
    </label>
   )}
   <div className="relative">
    <input
     id={name}
     type={inputType}
     placeholder={placeholder}
     className={cn(
      'flex h-12 md:h-[56px] items-center w-full rounded-[6px] border border-[#32475C38] bg-transparent px-4 py-2 text-sm md:text-base ring-offset-background text-[#32475CDE]',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      error && 'border-destructive focus-visible:ring-destructive',
     )}
     {...registerWithEvents}
     {...props}
    />

    {showPasswordToggle && (
     <button
      type="button"
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#32475C61] hover:opacity-90 transition-opacity duration-500"
      onClick={() => setShowPassword(!showPassword)}
     >
      {showPassword ? (
       <EyeOff className="h-4 w-4" />
      ) : (
       <Eye className="h-4 w-4" />
      )}
      <span className="sr-only">
       {showPassword ? 'Hide password' : 'Show password'}
      </span>
     </button>
    )}
   </div>

   {error && (
    <p className="text-xs text-destructive mt-1">{error.message}</p>
   )}
  </div>
 );
};

export default FormInput2;
