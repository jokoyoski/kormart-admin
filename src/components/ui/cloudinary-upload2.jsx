

// This is a mock implementation - you'll need to adapt it to your actual component
import { useRef } from "react"
import { X, ImageIcon } from "lucide-react"

const CloudinaryUpload = ({ images = [], onChange, multiple = false, delayUpload = false }) => {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    if (delayUpload) {
      // Just pass the file objects to parent component
      const newImages = [...images, ...files]
      onChange(newImages)
    } else {
      // Original behavior - upload immediately
      // This is just a placeholder for your existing upload logic
      console.log("Uploading files immediately")
      // Your existing upload logic here
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveImage = (index) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    onChange(newImages)
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
              <img src={image.url || image} alt={`Product image ${index + 1}`} className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-70 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {/* Add image button */}
        <div
          className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-xs text-center text-gray-500">Add Image</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  )
}

export default CloudinaryUpload
