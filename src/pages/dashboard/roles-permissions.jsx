import { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RolesTable from '@/components/roles/RolesTable';
import StaffTable from '@/components/roles/StaffTable';
import RoleModal from '@/components/roles/RoleModal';
import StaffModal from '@/components/roles/StaffModal';
import {
 useCreateRole,
 useUpdateRole,
} from '@/api/roles/create-role';
import {
 useCreateStaff,
 useUpdateStaff,
} from '@/api/roles/create-staff';

const RolesPermissionsPage = () => {
 const [activeTab, setActiveTab] = useState('members');
 const [showRoleModal, setShowRoleModal] = useState(false);
 const [showStaffModal, setShowStaffModal] = useState(false);
 const [editingRole, setEditingRole] = useState(null);
 const [editingStaff, setEditingStaff] = useState(null);

 // API hooks
 const createRole = useCreateRole();
 const updateRole = useUpdateRole();
 const createStaff = useCreateStaff();
 const updateStaff = useUpdateStaff();

 // Role handlers
 const handleCreateRole = () => {
  setEditingRole(null);
  setShowRoleModal(true);
 };

 const handleEditRole = (role = null) => {
  setEditingRole(role);
  setShowRoleModal(true);
 };

 const handleRoleSubmit = async (payload) => {
  try {
   if (editingRole) {
    await updateRole.mutateAsync({
     roleId: editingRole.id,
     payload,
    });
   } else {
    await createRole.mutateAsync(payload);
   }
   setShowRoleModal(false);
   setEditingRole(null);
  } catch (error) {
   console.log(error);
  }
 };

 // Staff handlers
 const handleCreateStaff = () => {
  setEditingStaff(null);
  setShowStaffModal(true);
 };

 const handleEditStaff = (staff = null) => {
  setEditingStaff(staff);
  setShowStaffModal(true);
 };

 const handleStaffSubmit = async (payload) => {
  try {
   if (editingStaff) {
    await updateStaff.mutateAsync({
     staffId: editingStaff.id,
     payload,
    });
   } else {
    await createStaff.mutateAsync(payload);
   }
   setShowStaffModal(false);
   setEditingStaff(null);
  } catch (error) {
   console.log(error);
  }
 };

 return (
  <div className="w-full px-4 md:px-10">
   {/* Header */}
   <div className="mb-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-2">
     Roles and Permissions
    </h1>
    <p className="text-gray-600">
     Here is all your kormat analytics overview
    </p>
   </div>

   {/* Tabs */}
   <Tabs
    value={activeTab}
    onValueChange={setActiveTab}
    className="w-full"
   >
    <TabsList className="mb-5 w-full justify-start  h-[33px]  items-start p-0 px-4 md:px-8 gap-8 bg-white">
     <TabsTrigger
      value="members"
      className="data-[state=active]:font-bold text-[#939393] data-[state=active]:text-[#3F3F3F] data-[state=active]:border-b-2 data-[state=active]:border-black !px-0 w-fit mx-0 pt-0"
     >
      Members
     </TabsTrigger>
     <TabsTrigger
      value="roles"
      className="data-[state=active]:font-bold text-[#939393] data-[state=active]:text-[#3F3F3F] data-[state=active]:border-b-2 data-[state=active]:border-black !px-0 w-fit mx-0 pt-0"
     >
      Roles
     </TabsTrigger>
    </TabsList>

    {/* Members Tab */}
    {activeTab === 'members' && (
     <div className="w-full">
      <StaffTable
       onEditStaff={handleEditStaff}
       handleCreateStaff={handleCreateStaff}
      />
     </div>
    )}

    {/* Roles Tab */}
    {activeTab === 'roles' && (
     <div className="w-full">
      {/* Roles Header */}

      <RolesTable
       onEditRole={handleEditRole}
       handleCreateRole={handleCreateRole}
      />
     </div>
    )}
   </Tabs>

   {/* Modals */}
   <RoleModal
    isOpen={showRoleModal}
    onClose={() => setShowRoleModal(false)}
    onSubmit={handleRoleSubmit}
    initialData={editingRole}
    isLoading={createRole?.isPending || updateRole?.isPending}
   />

   <StaffModal
    isOpen={showStaffModal}
    onClose={() => setShowStaffModal(false)}
    onSubmit={handleStaffSubmit}
    initialData={editingStaff}
    isLoading={createStaff?.isPending || updateStaff?.isPending}
   />
  </div>
 );
};

export default RolesPermissionsPage;
