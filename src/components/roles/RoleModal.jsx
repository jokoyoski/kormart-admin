import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import Modal from '../modals/Modal';
import { useGetPermissions } from '@/api/roles/get-roles';

const RoleModal = ({
 isOpen,
 onClose,
 onSubmit,
 initialData = null,
 isLoading = false,
}) => {
 const [formData, setFormData] = useState({
  name: '',
  description: '',
  permissions: [],
 });

 // Fetch permissions
 const { data: permissionsResponse } = useGetPermissions();
 const permissions = permissionsResponse?.data || [];

 useEffect(() => {
  if (initialData) {
   setFormData({
    name: initialData.name || '',
    description: initialData.description || '',
    permissions: initialData.permissions || [],
   });
  } else {
   setFormData({
    name: '',
    description: '',
    permissions: [],
   });
  }
 }, [initialData, isOpen]);

 const handlePermissionChange = (permission, checked) => {
  if (checked) {
   setFormData(prev => ({
    ...prev,
    permissions: [...prev.permissions, permission],
   }));
  } else {
   setFormData(prev => ({
    ...prev,
    permissions: prev.permissions.filter(p => p !== permission),
   }));
  }
 };

 const handleSubmit = (e) => {
  e.preventDefault();

  if (!formData.name.trim()) {
   toast.error('Role name is required');
   return;
  }

  if (formData.permissions.length === 0) {
   toast.error('Please select at least one permission');
   return;
  }

  const payload = {
   name: formData.name.trim(),
   description: formData.description.trim(),
   permissions: formData.permissions,
  };

  onSubmit(payload);
 };

 const handleClose = () => {
  if (!isLoading) {
   onClose();
  }
 };

 return (
  <Modal
   isOpen={isOpen}
   onClose={handleClose}
   className="rounded-[12px] px-4 md:px-8 py-8 max-w-[580px] !w-full h-fit max-h-[690px] md:max-h-[725px] overflow-y-auto shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)]"
   maxWidth={580}
   containerClassName="px-4"
  >
   {/* Close Button */}
   <button
    onClick={handleClose}
    className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
   >
    <X className="w-5 h-5 text-gray-500" />
   </button>

   <div className="pb-4 border-b border-[#D6DDEB] mb-5">
    <h3 className="text-[23px] font-extrabold text-[#3F3F3F] mb-1.5">
     {initialData ? 'Edit Role' : 'Create Role'}
    </h3>
    <p className="text-base text-[#939393]">
     This information can be created and edited
    </p>
   </div>

   <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
    <div>
     <label className="block text-sm font-medium text-[#25324B] mb-2">
      Role Name
     </label>
     <Input
      type="text"
      placeholder="Role name"
      value={formData.name}
      onChange={(e) =>
       setFormData((prev) => ({ ...prev, name: e.target.value }))
      }
      className="w-full !h-[50px] border border-gray-300 rounded-[4px] px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white p-2 text-sm leading-[140%]"
      disabled={isLoading}
     />
    </div>

    <div>
     <label className="block text-sm font-medium text-[#25324B] mb-2">
      Description
     </label>
     <Textarea
      placeholder="Role description"
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

    <div>
     <label className="block text-sm font-medium text-[#25324B] mb-3">
      Permissions
     </label>
     <div className="border border-gray-300 rounded-[4px] p-4 max-h-[200px] overflow-y-auto">
      {permissions.map((permission) => (
       <div key={permission} className="flex items-center space-x-2 mb-3">
        <Checkbox
         id={permission}
         checked={formData.permissions.includes(permission)}
         onCheckedChange={(checked) =>
          handlePermissionChange(permission, checked)
         }
         disabled={isLoading}
        />
        <label
         htmlFor={permission}
         className="text-sm font-medium text-[#25324B] cursor-pointer"
        >
         {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </label>
       </div>
      ))}
     </div>
     {formData.permissions.length > 0 && (
      <p className="text-xs text-gray-600 mt-2">
       Selected: {formData.permissions.join(', ')}
      </p>
     )}
    </div>

    <div className="flex pt-4 md:items-center md:justify-center gap-4 flex-col md:flex-row">
     <button
      type="button"
      onClick={handleClose}
      disabled={isLoading}
      className="w-full h-[50px] md:w-fit px-5 flex items-center justify-center rounded-[10px] border border-black text-black font-semibold text-base leading-[17px]"
     >
      Cancel
     </button>
     <button
      type="submit"
      disabled={isLoading || !formData.name.trim() || formData.permissions.length === 0}
      className="w-full md:w-fit h-[50px] px-5 bg-secondary hover:bg-secondary/90 text-black rounded-[10px] font-bold text-base leading-[17px]"
     >
      {isLoading ? (
       <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {initialData ? 'Updating...' : 'Creating...'}
       </div>
      ) : initialData ? (
       'Update Role'
      ) : (
       'Save Role'
      )}
     </button>
    </div>
   </form>
  </Modal>
 );
};

export default RoleModal;
