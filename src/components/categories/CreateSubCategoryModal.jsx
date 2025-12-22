import { useState, useCallback, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cloudinaryId } from '@/lib/utils';
import uploadImg from '@/assets/upload.png';
import { toast } from 'sonner';
import Modal from '../modals/Modal';
const CreateSubCategoryModal = ({
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
 const [selectedFile, setSelectedFile] = useState(null);
 const [uploadProgress, setUploadProgress] = useState(0);
 const [isUploading, setIsUploading] = useState(false);

 useEffect(() => {
  if (initialData) {
   setFormData({
    name: initialData.name || '',
    description: initialData.description || '',
    image: initialData.imageUrl || null,
    categoryId: initialData.categoryId || categoryId,
   });
   setImagePreview(initialData.imageUrl || null);
   setSelectedFile(null);
  } else {
   setFormData({
    name: '',
    description: '',
    image: null,
    categoryId: categoryId,
   });
   setImagePreview(null);
   setSelectedFile(null);
  }
 }, [initialData, categoryId, isOpen]);

 const uploadToCloudinary = useCallback(async (file) => {
  try {
   setIsUploading(true);
   setUploadProgress(0);

   const formData = new FormData();
   formData.append('file', file);
   formData.append('upload_preset', 'jokoyoski');
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

 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
   // Validate file type
   if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file');
    return;
   }

   // Validate file size (5MB limit)
   if (file.size > 5 * 1024 * 1024) {
    toast.error('File size should be less than 5MB');
    return;
   }

   // Store the file for later upload
   setSelectedFile(file);

   // Create preview
   const reader = new FileReader();
   reader.onload = (e) => {
    setImagePreview(e.target.result);
   };
   reader.readAsDataURL(file);
  }
 };

 const handleRemoveImage = () => {
  setImagePreview(null);
  setSelectedFile(null);
  setFormData((prev) => ({ ...prev, image: null }));
 };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name.trim()) {
   toast.error('Subcategory name is required');
   return;
  }

  try {
   let imageUrl = formData.image; // Keep existing image if editing and no new file selected

   // Upload new image if a file is selected
   if (selectedFile) {
    setIsUploading(true);
    imageUrl = await uploadToCloudinary(selectedFile);
  }

  const payload = {
   name: formData.name.trim(),
   description: formData.description.trim(),
   image: imageUrl,
   categoryId: formData.categoryId,
  };

  if (initialData) {
    payload.id = initialData.id || initialData.id;
  }

  onSubmit(payload);
  } catch (error) {
   console.error('Upload failed:', error);
   toast.error('Failed to upload image. Please try again.');
  } finally {
   setIsUploading(false);
  }
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
   className="rounded-[12px] px-4 md:px-8 py-8 max-w-[530px] !w-full h-full max-h-[690px] md:max-h-[725px] overflow-y-auto shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)]"
   maxWidth={530}
   containerClassName="px-4"
  >
   {/* Close Button */}
   <button
    onClick={handleClose}
    disabled={isLoading || isUploading}
    className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
   >
    <X className="w-5 h-5 text-gray-500" />
   </button>

   <div className="pb-4 border-b border-[#D6DDEB] mb-5">
    <h3 className="text-[23px] font-extrabold text-[#3F3F3F] mb-1.5">
     {initialData ? 'Edit Sub-Category' : 'Create Sub-Category'}
    </h3>
    <p className="text-base text-[#939393]">
     This information can be created and edited
    </p>
   </div>

   <form
    onSubmit={handleSubmit}
    className="space-y-5 md:space-y-6"
   >
    <div>
     <label className="block text-sm font-medium text-[#25324B] mb-2">
      Name Of Sub-Category
     </label>
     <Input
      type="text"
      placeholder="Subcategory name"
      value={formData.name}
      onChange={(e) =>
       setFormData((prev) => ({ ...prev, name: e.target.value }))
      }
      className="w-full  !h-[50px] border border-gray-300 rounded-[4px] px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white  p-2 text-sm leading-[140%]"
      disabled={isLoading}
     />
    </div>

    <div>
     <label className="block text-sm font-medium text-[#25324B] mb-2">
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
         Image that should be uploaded should be 500px and good quality. Image will be uploaded when you save the subcategory.
        </div>
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
     <label className="block text-sm font-medium text-[#25324B] mb-2">
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
      className="w-full min-h-[100px] resize-none border border-gray-300 rounded-[4px] px-4 placeholder:text-[#32475C99] text-sm"
      disabled={isLoading}
     />
    </div>

    <div className="flex pt-4 md:items-center md:justify-center gap-4 flex-col md:flex-row">
     <button
      type="button"
      //   variant="outline"

      onClick={handleClose}
      disabled={isLoading || isUploading}
      className="w-full  h-[50px] md:w-fit px-5 flex items-center justify-center rounded-[10px] border border-black text-black font-semibold text-base leading-[17px]"
     >
      Cancel SubCategory
     </button>
     <button
      type="submit"
      disabled={isLoading || isUploading || !formData.name.trim()}
      className="w-full  md:w-fit px-5  h-[50px] bg-secondary hover:bg-secondary/90 text-black rounded-[10px]  font-bold text-base leading-[17px]"
     >
      {isLoading || isUploading ? (
       <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {isUploading ? 'Uploading image...' : initialData ? 'Updating...' : 'Creating...'}
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

export default CreateSubCategoryModal;
