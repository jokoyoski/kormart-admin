/* eslint-disable react/prop-types */
import Modal from './Modal';
import CustomLoaderBtn from '../CustomLoaderBtn';
import Button from '../ui/button';

const DeleteAccountModal = ({
 open,
 setOpen,
 title = 'Delete this',
 cancelText = ' No, cancel',
 confirmText = ' Yes, delete account',
 onConfirm,
 isLoading,
 children,
}) => {
 return (
  <div>
   <Modal
    isOpen={open}
    className="max-w-[452px] rounded-lg mx-3"
    onClose={() => setOpen(!open)}
   >
    <div className="h-full w-full p-0 pb-7">
     {/* header */}
     <div className="flex items-center justify-between px-5 pt-6">
      <h3 className="text-base font-bold  text-neutralBlack font-helvetica text-center">
       {title}
      </h3>

      {/* <svg
       xmlns="http://www.w3.org/2000/svg"
       width="20"
       height="20"
       viewBox="0 0 20 20"
       fill="none"
       className="cursor-pointer"
       onClick={() => setOpen(!open)}
      >
       <path
        d="M5 15L15 5M5 5L15 15"
        stroke="#020709"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
       />
      </svg> */}
     </div>
     {/* divider */}
     <div className="mt-3 h-[2px] w-full bg-[#F5F6F7]" />

     <div className="mt-6 px-5">
      <div>{children}</div>
      <div className="mt-10 grid w-full grid-cols-1 gap-3 md:grid-cols-2">
       <Button
        variant="outline"
        className="h-12 font-medium"
        type="button"
        onClick={() => {
         setOpen(!open);
        }}
       >
        {cancelText}
       </Button>

       <CustomLoaderBtn
        type="button"
        disabled={isLoading}
        isLoading={isLoading}
        btnText={confirmText}
        className="flex h-12 items-center justify-center rounded-lg bg-[#FF3B30] font-medium text-white"
        onClick={onConfirm}
        variant="destructive"
       />
      </div>
     </div>
    </div>
   </Modal>
  </div>
 );
};

export default DeleteAccountModal;
