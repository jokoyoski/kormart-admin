import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Modal from '../modals/Modal';
import { useGetAllRoles } from '@/api/roles/get-roles';

const StaffModal = ({
 isOpen,
 onClose,
 onSubmit,
 initialData = null,
 isLoading = false,
}) => {
 const [formData, setFormData] = useState({
  name: '',
  email: '',
  roleId: '',
 });

 // Fetch roles for dropdown
 const { data: rolesResponse } = useGetAllRoles({ limit: 100 }); // Get all roles
 const roles = rolesResponse?.data || [];

 useEffect(() => {
  if (initialData) {
   setFormData({
    name: initialData.name || '',
    email: initialData.email || '',
    roleId: initialData.roles?.[0]?.id || '',
   });
  } else {
   setFormData({
    name: '',
    email: '',
    roleId: '',
   });
  }
 }, [initialData, isOpen]);

 const handleSubmit = (e) => {
  e.preventDefault();

  if (!formData.name.trim()) {
   toast.error('Staff name is required');
   return;
  }

  if (!formData.email.trim()) {
   toast.error('Email is required');
   return;
  }

  if (!formData.roleId) {
   toast.error('Please select a role');
   return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
   toast.error('Please enter a valid email address');
   return;
  }

  const payload = {
   name: formData.name.trim(),
   email: formData.email.trim(),
   role: formData.roleId,
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
     {initialData ? 'Edit Staff Member' : 'Create Staff Member'}
    </h3>
    <p className="text-base text-[#939393]">
     This information can be created and edited
    </p>
   </div>

   <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
    <div>
     <label className="block text-sm font-medium text-[#25324B] mb-2">
      Full Name
     </label>
     <Input
      type="text"
      placeholder="Staff member name"
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
      Email Address
     </label>
     <Input
      type="email"
      placeholder="staff@example.com"
      value={formData.email}
      onChange={(e) =>
       setFormData((prev) => ({ ...prev, email: e.target.value }))
      }
      className="w-full !h-[50px] border border-gray-300 rounded-[4px] px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white p-2 text-sm leading-[140%]"
      disabled={isLoading}
     />
    </div>

    <div>
     <label className="block text-sm font-medium text-[#25324B] mb-2">
      Role
     </label>
     <Select
      value={formData.roleId}
      onValueChange={(value) =>
       setFormData((prev) => ({ ...prev, roleId: value }))
      }
      disabled={isLoading}
     >
      <SelectTrigger className="w-full !h-[50px] border border-gray-300 rounded-[4px] px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white">
       <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
       {roles.map((role) => (
        <SelectItem key={role.id} value={role.id}>
         <div className="flex flex-col">
          <span className="font-medium">{role.name}</span>
          <span className="text-xs text-gray-500">{role.description}</span>
         </div>
        </SelectItem>
       ))}
      </SelectContent>
     </Select>
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
      disabled={isLoading || !formData.name.trim() || !formData.email.trim() || !formData.roleId}
      className="w-full md:w-fit h-[50px] px-5 bg-secondary hover:bg-secondary/90 text-black rounded-[10px] font-bold text-base leading-[17px]"
     >
      {isLoading ? (
       <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {initialData ? 'Updating...' : 'Creating...'}
       </div>
      ) : initialData ? (
       'Update Staff Member'
      ) : (
       'Save Staff Member'
      )}
     </button>
    </div>
   </form>
  </Modal>
 );
};

export default StaffModal;
