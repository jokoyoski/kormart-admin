import { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

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
   // Store the actual file object for later upload
  //  setValue(name, e.target.files);
   onChange(e); // Call the original onChange from register
  }
 };

 useEffect(() => {
  if (value) {
   if (typeof value === 'string') {
    // If value is a URL string, extract filename from URL
    const urlParts = value.split('/');
    const fileNameFromUrl =
     urlParts[urlParts.length - 1].split('?')[0];
    setFileName(fileNameFromUrl || 'File uploaded');
   } else if (value[0] instanceof File) {
    // If value is a File object
    setFileName(value[0].name);
   } else if (value[0] && value[0].name) {
    // If value is an object with name property
    setFileName(value[0].name);
   }
  } else {
   setFileName('');
  }
 }, [value]);

 const handleClick = () => {
  inputRef.current?.click();
 };

 const getDisplayFileName = () => {
  if (fileName) return fileName;

  // If we have a string value (URL), extract the filename
  if (typeof value === 'string') {
   const urlParts = value.split('/');
   return (
    urlParts[urlParts.length - 1].split('?')[0] || 'File uploaded'
   );
  }

  return 'Choose file...';
 };

 return (
  <div className={cn('w-full relative', className)}>
   <div
    className={cn(
     'flex h-12 md:h-[56px] items-center w-full rounded-[6px] border border-[#32475C38] bg-transparent px-4 py-2 text-sm md:text-base ring-offset-background text-[#32475CDE]',
     'file:border-0 file:bg-transparent file:text-sm file:font-medium',
     'placeholder:text-muted-foreground',
     'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-2',
     'disabled:cursor-not-allowed disabled:opacity-50',
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
       'transform -translate-y-[17px] left-1 scale-[0.8] px-2 top-[6px] font-medium bg-white rounded',
      )}
     >
      {label}
     </label>
    )}

    <span className="text-sm truncate flex-1">
     {getDisplayFileName()}
    </span>

    <Upload className="h-4 w-4 text-muted-foreground ml-2" />
   </div>

   {error && (
    <p className="text-xs text-destructive mt-1">{error.message}</p>
   )}
  </div>
 );
};

export default FormFileUpload;
