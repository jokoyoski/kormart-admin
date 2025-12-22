
import { useState, useCallback } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Button from "@/components/ui/button"
import { cloudinaryId } from "@/lib/utils";

const CloudinaryUpload = ({ images = [], onChange, multiple = true }) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadToCloudinary = useCallback(async (file) => {
    try {
      // Create form data
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "yayako_super_app") // Replace with your upload preset
      formData.append("folder", "products")

      // Track upload progress
      const xhr = new XMLHttpRequest()
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudinaryId}/image/upload`)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100)
          setProgress(percentComplete)
        }
      }

      return new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText)
            resolve(response.secure_url)
          } else {
            reject(new Error("Upload failed"))
          }
        }
        xhr.onerror = () => reject(new Error("Upload failed"))
        xhr.send(formData)
      })
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error)
      throw error
    }
  }, [])

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    setUploading(true)
    setProgress(0)

    try {
      const uploadPromises = files.map((file) => uploadToCloudinary(file))
      const uploadedUrls = await Promise.all(uploadPromises)

      // Combine with existing images if multiple is true
      const newImages = multiple ? [...images, ...uploadedUrls] : uploadedUrls
      onChange(newImages)
      toast.success(`${files.length} image${files.length > 1 ? "s" : ""} uploaded successfully`)
    } catch (error) {
      toast.error("Failed to upload images. Please try again.")
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const removeImage = (index) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image || "/placeholder.svg"}
              alt={`Product ${index + 1}`}
              className="h-32 w-full object-contain rounded-md border border-gray-200"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        <label className="h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="mt-2 text-sm text-gray-500">{progress}%</span>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">{multiple ? "Add Images" : "Add Image"}</span>
            </>
          )}
        </label>
      </div>

      {images.length > 0 && (
        <div className="flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={() => onChange([])} className="text-sm">
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}

export default CloudinaryUpload
