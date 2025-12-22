/* eslint-disable react/prop-types */
import { Loader2Icon } from "lucide-react";
import React from "react";
import  Button  from "./ui/button";

const CustomLoaderBtn = ({
  disabled,
  btnText,
  isLoading,
  className,
  variant = "default",
  type = "submit",
  onClick,
}) => {
  return (
    <Button
      variant={variant}
      className={className}
      disabled={disabled || isLoading}
      type={type}
      onClick={onClick}
    >
      {isLoading ? (
        <span>
          <Loader2Icon className="animate-spin" />
        </span>
      ) : (
        btnText
      )}
    </Button>
  );
};

export default CustomLoaderBtn;
