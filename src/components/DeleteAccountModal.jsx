'use client';

import { X } from 'lucide-react';

const DeleteAccountModal = ({ isOpen, onClose, onConfirm }) => {
 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
   {/* Backdrop */}
   <div
    className="absolute inset-0 bg-black/20 backdrop-blur-sm"
    onClick={onClose}
   />

   {/* Modal */}
   <div className="relative bg-white rounded-[12px] p-8 w-full max-w-[400px] mx-4 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)]">
    {/* Close Button */}
    <button
     onClick={onClose}
     className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
    >
     <X className="w-5 h-5 text-gray-500" />
    </button>

    {/* Content */}
    <div className="text-center">
     <h3 className="text-[18px] font-bold text-gray900 mb-4">
      Delete Account
     </h3>

     <p className="text-sm text-gray600 mb-8">
      Are you sure, you want to delete this account
     </p>

     {/* Buttons */}
     <div className="flex gap-4">
      <button
       onClick={onClose}
       className="flex-1 h-[44px] bg-gray-200 text-gray700 rounded-[8px] text-sm font-semibold hover:bg-gray-300 transition-colors"
      >
       NO
      </button>

      <button
       onClick={onConfirm}
       className="flex-1 h-[44px] bg-secondary text-black rounded-[8px] text-sm font-semibold hover:bg-secondary/90 transition-colors"
      >
       SUBMIT
      </button>
     </div>
    </div>
   </div>
  </div>
 );
};

export default DeleteAccountModal;
