import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const FormInput = ({
 label,
 name,
 type = 'text',
 placeholder,
 register,
 errors,
 className,
 showPasswordToggle = false,
 value = '',
 extraChildren,
 ...props
}) => {
 const [showPassword, setShowPassword] = useState(false);
 const [isFocused, setIsFocused] = useState(false);
 const [hasValue, setHasValue] = useState(false);
 const inputType = showPassword ? 'text' : type;
 const error = errors?.[name];

 // Check if the input has a value
 useEffect(() => {
  if (value) {
   setHasValue(!!value);
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
   setHasValue(!!e.target.value);
   if (register(name).onBlur) register(name).onBlur(e);
  },
  onChange: (e) => {
   setHasValue(!!e.target.value);
   if (register(name).onChange) register(name).onChange(e);
  },
 };
 // console.log("registerWithEvents", registerWithEvents)
 return (
  <div className={cn('w-full space-y-1.5 pt-1', className)}>
   <div className="mb-1.5 flex items-center justify-between">
    <label
     htmlFor={name}
     className={cn(
      'text-gray900 font-outfit font-semibold text-sm  leading-[140%]',
     )}
    >
     {label}
    </label>
    {extraChildren && <div>{extraChildren}</div>}
   </div>
   <div className="relative">
    <input
     id={name}
     type={inputType}
     placeholder={placeholder}
     className={cn(
      'flex h-12 items-center w-full rounded-[1px] border border-gray100  bg-transparent px-4 py-2 text-sm md:text-base ring-offset-background text-gray900',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-gray400',
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
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray900 hover:opacity-90 transition-opacity duration-500"
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

export default FormInput;
