import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const FormFileUpload = ({
 label,
 name,
 accept,
 register,
 errors,
 setValue,
 value = '',
 className,
 ...props
}) => {
 const [fileName, setFileName] = useState('');
 const inputRef = useRef(null);
 const error = errors?.[name];

 const { ref, onChange, ...rest } = register(name);

 const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
   setFileName(file.name);
   onChange(e); // Call the original onChange from register
  }
 };

 useEffect(() => {
  // console.log('value', value);
  if (value) {
   const file = value[0];
  //  console.log('file', file);
   if (file) {
    setFileName(file.name);
   }
  }
 }, [value]);

 const handleClick = () => {
  inputRef.current?.click();
 };

 return (
  <div className={cn('w-full relative', className)}>
   {/* {label && (
        <label htmlFor={name} className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )} */}

   <div
    className={cn(
     'flex h-12 md:h-[56px] items-center w-full rounded-[6px] border border-[#32475C38] bg-transparent px-4 py-2 text-sm md:text-base ring-offset-background text-[#32475CDE]',
     'file:border-0 file:bg-transparent file:text-sm file:font-medium',
     'placeholder:text-muted-foreground',
     'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-2',
     'disabled:cursor-not-allowed disabled:opacity-50',
     '', // Add padding to make room for the label
     error && 'border-destructive focus-visible:ring-destructive',
    )}
    onClick={handleClick}
   >
    <input
     type="file"
     id={name}
     accept={accept}
     className="hidden"
     ref={(e) => {
      ref(e);
      inputRef.current = e;
     }}
     onChange={handleFileChange}
     {...rest}
     {...props}
    />

    {label && (
     <label
      htmlFor={name}
      className={cn(
       'absolute pointer-events-none transition-all duration-200 text-[#32475C61]',
       //  isFocused || hasValue
       'transform -translate-y-[17px] left-1 scale-[0.8] px-2 top-[6px] font-medium bg-white rounded',
       // 'top-1/2 -translate-y-1/2 text-sm md:text-base left-4 ',
      )}
     >
      {label}
     </label>
    )}

    <span className="text-sm truncate">
     {fileName || 'Choose file...'}
    </span>

    <Upload className="h-4 w-4 text-muted-foreground" />
   </div>

   {error && (
    <p className="text-xs text-destructive mt-1">{error.message}</p>
   )}
  </div>
 );
};

export default FormFileUpload;
