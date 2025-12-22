

import { useState, useEffect } from "react"
import { Check, Copy } from "lucide-react"
import Button from "@/components/ui/button"

const COLORS = {
  primary: [
    { name: "Red", code: "#f44336" },
    { name: "Pink", code: "#e91e63" },
    { name: "Purple", code: "#9c27b0" },
    { name: "Deep Purple", code: "#673ab7" },
    { name: "Indigo", code: "#3f51b5" },
    { name: "Blue", code: "#2196f3" },
    { name: "Light Blue", code: "#03a9f4" },
    { name: "Cyan", code: "#00bcd4" },
    { name: "Teal", code: "#009688" },
    { name: "Green", code: "#4caf50" },
    { name: "Light Green", code: "#8bc34a" },
    { name: "Lime", code: "#cddc39" },
    { name: "Yellow", code: "#ffeb3b" },
    { name: "Amber", code: "#ffc107" },
    { name: "Orange", code: "#ff9800" },
    { name: "Deep Orange", code: "#ff5722" },
    { name: "Brown", code: "#795548" },
    { name: "Grey", code: "#9e9e9e" },
  ],
  blackAndWhite: [
    { name: "White", code: "#ffffff" },
    { name: "Light Pink", code: "#ffebee" },
    { name: "Light Red", code: "#ffcdd2" },
    { name: "Red", code: "#ef5350" },
    { name: "Dark Red", code: "#c62828" },
    { name: "Darker Red", code: "#b71c1c" },
    { name: "Black", code: "#000000" },
  ],
}

const ColorPicker = ({ onSelectColor, initialColor = null, onClose }) => {
  const [activeTab, setActiveTab] = useState("primary")
  const [selectedColor, setSelectedColor] = useState(initialColor || null)
  const [colorName, setColorName] = useState(initialColor?.name || "")
  const [colorCode, setColorCode] = useState(initialColor?.code || "")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (initialColor) {
      setSelectedColor(initialColor)
      setColorName(initialColor.name)
      setColorCode(initialColor.code)
    }
  }, [initialColor])

  const handleColorSelect = (color) => {
    setSelectedColor(color)
    setColorName(color.name)
    setColorCode(color.code)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(colorCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirm = () => {
    if (colorName && colorCode) {
      onSelectColor({ name: colorName, code: colorCode })
    }
  }

  const handleCancel = () => {
    if (onClose) {
      onClose()
    } else {
      onSelectColor(null)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md overflow-y-auto">
      <h3 className="text-lg font-medium text-text-primary mb-3">Select Product Color</h3>

      <div className="flex mb-4 bg-gray-100 rounded-lg">
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-sm ${activeTab === "primary" ? "bg-white shadow-sm" : ""}`}
          onClick={() => setActiveTab("primary")}
        >
          Primary
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-sm ${activeTab === "blackAndWhite" ? "bg-white shadow-sm" : ""}`}
          onClick={() => setActiveTab("blackAndWhite")}
        >
          Black & White
        </button>
      </div>

      <div className="grid grid-cols-8 gap-[6px] mb-2">
        {COLORS[activeTab].map((color) => (
          <button
            key={color.code}
            className="w-8 h-8 rounded-lg relative border border-[#efefef]"
            style={{ backgroundColor: color.code }}
            onClick={() => handleColorSelect(color)}
          >
            {selectedColor?.code === color.code && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="text-white" size={20} />
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedColor && (
        <>
          <div className="mb-2 text-center">{colorName}</div>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={colorCode}
              onChange={(e) => setColorCode(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-1.5 text-sm"
            />
            <button
              onClick={handleCopyCode}
              className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-3 py-1.5 "
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </>
      )}

      <div className="flex justify-between">
        <Button variant="outline" className="text-sm" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} className="text-sm" disabled={!colorName || !colorCode}>
          OK
        </Button>
      </div>
    </div>
  )
}

export default ColorPicker
