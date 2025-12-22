
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

const OtpInput = ({ length = 6, onComplete, className, inputClassName, disabled = false }) => {
  const [otp, setOtp] = useState(Array(length).fill(""))
  const inputRefs = useRef([])

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus()
    }

    // Call onComplete when all fields are filled
    if (value && index === length - 1 && newOtp.every((digit) => digit)) {
      onComplete?.(newOtp.join(""))
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current field is empty and backspace is pressed, focus previous field
        const newOtp = [...otp]
        newOtp[index - 1] = ""
        setOtp(newOtp)
        inputRefs.current[index - 1].focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content matches the expected length
    if (new RegExp(`^\\d{${length}}$`).test(pastedData)) {
      const digits = pastedData.split("")
      setOtp(digits)

      // Focus the last input
      inputRefs.current[length - 1].focus()

      // Call onComplete
      onComplete?.(pastedData)
    }
  }

  return (
    <div className={cn("flex justify-center gap-2 sm:gap-4", className)}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled}
          className={cn(
            "w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border border-gray-300 rounded-md",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            "disabled:bg-gray-100 disabled:text-gray-400",
            inputClassName,
          )}
        />
      ))}
    </div>
  )
}

export default OtpInput
