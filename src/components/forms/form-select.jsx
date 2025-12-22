import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FormSelect = ({
 label,
 name,
 options,
 register,
 errors,
 className,
 value = '',
 ...props
}) => {
 const [isFocused, setIsFocused] = useState(false);
 const [hasValue, setHasValue] = useState(false);
 const error = errors?.[name];

 // Check if the select has a value
 useEffect(() => {
  if (value) {
   setHasValue(!!value && value !== '');
  }
 }, [value]);

 // Get the register object with added event handlers
 const registerWithEvents = {
  ...register(name),
  onFocus: (e) => {
   setIsFocused(true);
   if (register(name).onFocus) register(name).onFocus(e);
  },
  onBlur: (e) => {
   setIsFocused(false);
   setHasValue(!!e.target.value && e.target.value !== '');
   if (register(name).onBlur) register(name).onBlur(e);
  },
  onChange: (e) => {
   setHasValue(!!e.target.value && e.target.value !== '');
   if (register(name).onChange) register(name).onChange(e);
  },
 };

 return (
  <div className={cn('w-full space-y-1.5', className)}>
   <div className="relative">
    <select
     id={name}
     className={cn(
      'flex h-[56px] items-center w-full rounded-[6px] border border-[#32475C38] bg-transparent px-4 py-2 text-base ring-offset-background text-[#32475CDE]',
      'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'appearance-none',
      error && 'border-destructive focus-visible:ring-destructive',
     )}
     {...registerWithEvents}
     {...props}
    >
     <option
      value="ook"
      //   disabled
     >
      {''}
     </option>

     {options.map((option, idx) => (
      <option
       key={idx}
       value={option.value}
      >
       {option.label}
      </option>
     ))}
    </select>

    {label && (
     <label
      htmlFor={name}
      className={cn(
       'absolute pointer-events-none transition-all duration-200 text-[#32475C61]',
       isFocused || hasValue
        ? 'transform -translate-y-[17px] left-1 scale-[0.8] px-2 top-[6px] font-medium bg-white rounded'
        : 'top-1/2 -translate-y-1/2 text-base left-4',
      )}
     >
      {label}
     </label>
    )}

    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#32475C61] pointer-events-none" />
   </div>

   {error && (
    <p className="text-xs text-destructive mt-1">{error.message}</p>
   )}
  </div>
 );
};

export default FormSelect;
