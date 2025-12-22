

import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';
import { useEffect } from 'react';

const Modal = ({
 isOpen,
 onClose,
 className,
 title,
 subtitle,
 showCloseBtn = true,
 children,
 maxWidth = 480,
 containerClassName,
}) => {
 useEffect(() => {
  if (isOpen) {
   document.body.style.overflow = 'hidden';
  } else {
   document.body.style.overflow = 'auto';
  }
 }, [isOpen]);

 return (
  <div
   className={cn(
    'fixed inset-0 z-50 overflow-auto transition-opacity duration-300 scrollbar-hide',
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
   )}
  >
   <div
    className={cn(
     'flex items-ed md: items-center justify-center h-screen max-h-screen py-4',
     containerClassName,
    )}
   >
    <div
     className="absolute inset-0 bg-black/20 backdrop-blur-sm"
     onClick={onClose}
    />
    <div
     className={cn(
      'bg-white rounded-lg z-10 transform transition-transform duration-300  w-full shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)]',
      isOpen ? 'translate-y-0' : 'translate-y-full',
      className,
     )}
     style={{ maxWidth }}
    >
     {title && (
      <div className="flex items-center gap-4 mb-4">
       <div className="flex-1">
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle && <p className="text-gray text-sm">{title}</p>}
       </div>
       {showCloseBtn && (
        <button
         type="button"
         className="text-xl text-gray-dark"
         onClick={onClose}
        >
         <XIcon />
        </button>
       )}
      </div>
     )}

     {children}
    </div>
   </div>
  </div>
 );
};

export default Modal;
