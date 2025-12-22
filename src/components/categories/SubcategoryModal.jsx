import { useState, useCallback, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import Modal from './Modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cloudinaryId } from '@/lib/utils';
import uploadImg from '@/assets/upload.png';
const SubcategoryModal = ({
 isOpen,
 onClose,
 onSubmit,
 initialData = null,
 categoryId = null,
 isLoading = false,
}) => {
 const [formData, setFormData] = useState({
  name: '',
  description: '',
  image: null,
  categoryId: categoryId,
 });
 const [imagePreview, setImagePreview] = useState(null);
 const [uploadProgress, setUploadProgress] = useState(0);
 const [isUploading, setIsUploading] = useState(false);

 useEffect(() => {
  if (initialData) {
   setFormData({
    name: initialData.name || '',
    description: initialData.description || '',
    image: initialData.image || null,
    categoryId: initialData.categoryId || categoryId,
   });
   setImagePreview(initialData.image || null);
  } else {
   setFormData({
    name: '',
    description: '',
    image: null,
    categoryId: categoryId,
   });
   setImagePreview(null);
  }
 }, [initialData, categoryId, isOpen]);

 const uploadToCloudinary = useCallback(async (file) => {
  try {
   setIsUploading(true);
   setUploadProgress(0);

   const formData = new FormData();
   formData.append('file', file);
   formData.append('upload_preset', 'yayako_super_app');
   formData.append('folder', 'subcategories');

   const xhr = new XMLHttpRequest();
   xhr.open(
    'POST',
    `https://api.cloudinary.com/v1_1/${cloudinaryId}/image/upload`,
   );

   xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
     const percentComplete = Math.round(
      (event.loaded / event.total) * 100,
     );
     setUploadProgress(percentComplete);
    }
   };

   return new Promise((resolve, reject) => {
    xhr.onload = () => {
     setIsUploading(false);
     if (xhr.status >= 200 && xhr.status < 300) {
      const response = JSON.parse(xhr.responseText);
      resolve(response.secure_url);
     } else {
      reject(new Error('Upload failed'));
     }
    };
    xhr.onerror = () => {
     setIsUploading(false);
     reject(new Error('Upload failed'));
    };
    xhr.send(formData);
   });
  } catch (error) {
   setIsUploading(false);
   console.error('Error uploading to Cloudinary:', error);
   throw error;
  }
 }, []);

 const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
   // Validate file type
   if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
   }

   // Validate file size (5MB limit)
   if (file.size > 5 * 1024 * 1024) {
    alert('File size should be less than 5MB');
    return;
   }

   // Create preview
   const reader = new FileReader();
   reader.onload = (e) => {
    setImagePreview(e.target.result);
   };
   reader.readAsDataURL(file);

   try {
    const imageUrl = await uploadToCloudinary(file);
    setFormData((prev) => ({ ...prev, image: imageUrl }));
   } catch (error) {
    console.error('Upload failed:', error);
    alert('Failed to upload image. Please try again.');
    setImagePreview(null);
   }
  }
 };

 const handleRemoveImage = () => {
  setImagePreview(null);
  setFormData((prev) => ({ ...prev, image: null }));
 };

 const handleSubmit = (e) => {
  e.preventDefault();

  if (!formData.name.trim()) {
   alert('Subcategory name is required');
   return;
  }

  const payload = {
   name: formData.name.trim(),
   description: formData.description.trim(),
   image: formData.image,
   categoryId: formData.categoryId,
  };

  if (initialData) {
   payload.id = initialData.id;
  }

  // console.log("Subcategory payload:", payload)
  onSubmit(payload);
 };

 const handleClose = () => {
  if (!isLoading && !isUploading) {
   onClose();
  }
 };

 return (
  <Modal
   isOpen={isOpen}
   onClose={handleClose}
   className="p-6 -4 !max-w-[548px] !rounded-[22px] !w-full pb-12 h-full max-h-[690px] md:max-h-[725px] overflow-y-auto"
   maxWidth={548}
   containerClassName="px-4"
  >
   <div className="flex items-center justify-between mb-6">
    <h2 className="text-lg md:text-[24px] font-semibold text-[#191C1F]">
     {initialData ? 'Edit Subcategory' : 'Add new subcategory'}
    </h2>
    <button
     onClick={handleClose}
     disabled={isLoading || isUploading}
     className="p-1 hover:bg-gray-100 rounded-full transition-colors"
    >
     <X className="h-5 w-5 text-gray-500" />
    </button>
   </div>

   <form
    onSubmit={handleSubmit}
    className="space-y-5 md:space-y-8"
   >
    <div>
     <label className="block text-sm md:text-base font-semibold text-text-primary mb-1.5">
      Subcategory name
     </label>
     <Input
      type="text"
      placeholder="Subcategory name"
      value={formData.name}
      onChange={(e) =>
       setFormData((prev) => ({ ...prev, name: e.target.value }))
      }
      className="w-full !h-[43px] border-[0.75px] rounded-[4px] bg-white border-[#32475C38] p-2 text-sm leading-[140%] placeholder:text-[#32475C99] text-text-primary"
      disabled={isLoading}
     />
    </div>

    <div>
     <label className="block text-sm md:text-base font-semibold text-text-primary mb-1.5 line-clamp-1">
      Upload Image Of Sub Category
     </label>
     <div className="border-[0.73px] border-[#32475C1F] rounded-[6px] p-6 h-82px] text-center hover:bordray-400 transition-colors">
      {imagePreview ? (
       <div className="relative">
        <img
         src={imagePreview || '/placeholder.svg'}
         alt="Preview"
         className="mx-auto h-32 w-32 object-cover rounded-lg"
        />
        <button
         type="button"
         onClick={handleRemoveImage}
         disabled={isLoading || isUploading}
         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        >
         <X className="h-4 w-4" />
        </button>
       </div>
      ) : (
       <label htmlFor="subcategory-image">
        <img
         src={uploadImg}
         alt="upload-icon"
         className="size-[20px] mx-auto"
        />

        <p className="font-semibold text-base leading-[140%] text-center my-[6px] text-text-primary">
         Upload Image of Sub Category
        </p>
        <div className="text-[#32475C99] text-xs text-center leading-[140%] ">
         Image that should be uploaded should be 500px and good
         quality
        </div>
        {isUploading && (
         <div className="mb-4">
          <div className="flex items-center justify-center gap-2 text-blue-600">
           <Loader2 className="h-4 w-4 animate-spin" />
           <span>Uploading... {uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
           <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
           />
          </div>
         </div>
        )}
        <input
         type="file"
         accept="image/*"
         onChange={handleImageChange}
         disabled={isLoading || isUploading}
         className="hidden"
         id="subcategory-image"
        />
       </label>
      )}
     </div>
    </div>

    <div>
       <label className="block text-sm md:text-base font-semibold text-text-primary mb-1.5">
      Descriptions
     </label>
     <Textarea
      placeholder="Descriptions"
      value={formData.description}
      onChange={(e) =>
       setFormData((prev) => ({
        ...prev,
        description: e.target.value,
       }))
      }
       className="w-full min-h-[100px] resize-none border-[#32475C38] border-[0.73px] text-text-primary placeholder:text-[#32475C99] text-sm"
      disabled={isLoading}
     />
    </div>

      <div className="flex pt-4 md:items-center md:justify-center gap-4 flex-col md:flex-row">
     <button
      type="button"
      //   variant="outline"

      onClick={handleClose}
      disabled={isLoading || isUploading}
      className="w-full  h-12 md:w-fit px-6 py-2 rounded-[8px] bg-[#B0B5BE] text-white font-medium text-base leading-[17px]"
     >
      Cancel SubCategory
     </button>
     <button
      type="submit"
      disabled={isLoading || isUploading || !formData.name.trim()}
      className="w-full h-12  md:w-fit px-6 py-2 rounded-[8px] bg-blue100 text-white font-medium text-base leading-[17px]"
     >
      {isLoading ? (
       <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {initialData ? 'Updating...' : 'Creating...'}
       </div>
      ) : initialData ? (
       'Update SubCategory'
      ) : (
       'Save SubCategory'
      )}
     </button>
    </div>
   </form>
  </Modal>
 );
};

export default SubcategoryModal;
