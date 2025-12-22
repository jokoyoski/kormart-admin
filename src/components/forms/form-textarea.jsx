
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const FormTextarea = ({ label, name, placeholder, register, errors, className, value = "", rows = 4, ...props }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  const error = errors?.[name]

  // Check if the textarea has a value
  useEffect(() => {
    if (value) {
      setHasValue(!!value)
    }
  }, [value])

  // Get the register object with added event handlers
  const registerWithEvents = {
    ...register(name),
    onFocus: (e) => {
      setIsFocused(true)
      if (register(name).onFocus) register(name).onFocus(e)
    },
    onBlur: (e) => {
      setIsFocused(false)
      setHasValue(!!e.target.value)
      if (register(name).onBlur) register(name).onBlur(e)
    },
    onChange: (e) => {
      setHasValue(!!e.target.value)
      if (register(name).onChange) register(name).onChange(e)
    },
  }

  return (
    <div className={cn("w-full space-y-1.5 pt-1", className)}>
      <div className="relative">
        <textarea
          id={name}
          rows={rows}
          className={cn(
            "flex w-full rounded-[6px] border border-[#32475C38] bg-transparent px-4 py-3 text-sm md:text-base ring-offset-background text-[#32475CDE]",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
          )}
          {...registerWithEvents}
          {...props}
        />

        {label && (
          <label
            htmlFor={name}
            className={cn(
              "absolute pointer-events-none transition-all duration-200 text-[#32475C61]",
              isFocused || hasValue
                ? "transform -translate-y-[17px] left-1 scale-[0.8] px-2 top-[6px] font-medium bg-white rounded"
                : "top-3 text-sm md:text-base left-4",
            )}
          >
            {label}
          </label>
        )}
      </div>

      {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
    </div>
  )
}

export default FormTextarea
