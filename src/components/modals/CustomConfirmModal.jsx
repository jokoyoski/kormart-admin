
import { cn } from "@/lib/utils";
import Modal from "./Modal";
import CustomLoaderBtn from "../CustomLoaderBtn";

const CustomConfirmModal = ({
  open,
  setOpen,
  title = "Confirm Action",
  primaryBtnText = "Cancel",
  primaryBtnClassName,
  secondaryBtnText = "Confirm",
  secondaryBtnClassName,
  containerClassName,
  onPrimaryBtnClick,
  onSecondaryBtnClick = () => {},
  isLoading,
  children,
  actionType = "default", // "activate", "deactivate", "verify", "unverify", "default"
}) => {
  // Get button styles based on action type
  const getButtonStyles = () => {
    switch (actionType) {
      case "activate":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "deactivate":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "verify":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "unverify":
        return "bg-orange-600 hover:bg-orange-700 text-white";
      default:
        return "!bg-primary hover:!bg-primary/90 text-white";
    }
  };
  return (
    <div>
      <Modal
        isOpen={open}
        className={cn("max-w-[452px] rounded-lg", containerClassName)}
        onClose={() => setOpen(!open)}
      >
        <div className="h-full w-full p-0 pb-7">
          {/* header */}
          <div className="flex items-center justify-between px-5 pt-6">
            <h3 className="hleading font-helvetica text-base font-bold text-neutralBlack">
              {title}
            </h3>

            <svg
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
            </svg>
          </div>
          {/* divider */}
          <div className="mt-3 h-[2px] w-full bg-[#F5F6F7]" />

          <div className="mt-6 px-5">
            <div>{children}</div>
            <div className="mt-10 grid w-full grid-cols-1 gap-3 md:grid-cols-2">
              <button
                className={cn(
                  "flex h-12 w-full items-center justify-center rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50",
                  primaryBtnClassName,
                )}
                onClick={() => {
                  if (onPrimaryBtnClick) {
                    onPrimaryBtnClick();
                  } else {
                    setOpen(!open);
                  }
                }}
                disabled={isLoading}
              >
                {primaryBtnText}
              </button>

              <CustomLoaderBtn
                className={cn("h-12 rounded-lg", getButtonStyles(), secondaryBtnClassName)}
                onClick={onSecondaryBtnClick}
                disabled={isLoading}
                isLoading={isLoading}
                btnText={secondaryBtnText}
                type="button"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomConfirmModal;
