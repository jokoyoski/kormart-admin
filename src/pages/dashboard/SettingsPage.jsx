import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@/components/ui/button';
import FormInput from '@/components/forms/form-input';
import { Card } from '@/components/ui/card';
import { Lock, Shield } from 'lucide-react';
import { useResetPassword } from '@/api/auth/reset-password';

import { changePasswordSchema } from '@/utils/schemas';

const SettingsPage = () => {
 const { mutate: resetPassword, isPending } = useResetPassword();

 const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
 } = useForm({
  resolver: zodResolver(changePasswordSchema),
  defaultValues: {
   oldPassword: '',
   newPassword: '',
   confirmPassword: '',
  },
 });

 const onSubmit = async (data) => {
  resetPassword(
   {
    currentPassword: data.oldPassword,
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword,
   },
   {
    onSuccess: () => {
     reset();
    },
   },
  );
 };

 const onError = (errors) => {
  console.error('Form errors:', errors);
  toast.error('Please check the form for errors');
 };

 return (
  <div className="w-full px-4 md:px-10">
   <div className="w-full pt-4 pb-8">
    <div className="mb-6">
     <h2 className="text-[20px] text-gray900 font-extrabold leading-[140%]">
      Settings
     </h2>
     <p className="mt-1 text-sm text-gray600 leading-[140%]">
      Manage your account settings and password
     </p>
    </div>

    <div className="">
     <Card className="p-6 w-full">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray100">
       <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Lock className="w-5 h-5 text-primary" />
       </div>
       <div>
        <h3 className="text-base font-bold text-gray900">
         Change Password
        </h3>
        <p className="text-sm text-gray600">
         Update your password to keep your account secure
        </p>
       </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)}>
       <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormInput
         label="Old Password"
         name="oldPassword"
         type="password"
         placeholder="Enter your current password"
         register={register}
         errors={errors}
        />

        <FormInput
         label="New Password"
         name="newPassword"
         type="password"
         placeholder="Enter your new password"
         register={register}
         errors={errors}
        />

        <FormInput
         label="Confirm New Password"
         name="confirmPassword"
         type="password"
         placeholder="Confirm your new password"
         register={register}
         errors={errors}
        />
       </div>

       <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-2">
         <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
         <div className="text-xs text-blue-800">
          <p className="font-semibold mb-1">Password Requirements:</p>
          <ul className="list-disc list-inside space-y-0.5">
           <li>At least 8 characters long</li>
           <li>Contains at least one uppercase letter</li>
           <li>Contains at least one lowercase letter</li>
           <li>Contains at least one number</li>
          </ul>
         </div>
        </div>
       </div>

       <div className="flex gap-3 mt-6">
        <Button
         type="submit"
         className="w-[200px] rounded-[2px] text-sm leading-[140%] font-publicSans"
         isLoading={isPending}
         disabled={isPending}
        >
         <span className="font-semibold">
          {isPending ? 'Changing Password...' : 'Change Password'}
         </span>
        </Button>
        <Button
         type="button"
         variant="outline"
         onClick={() => reset()}
         className="px-6 rounded-[2px] text-sm leading-[140%] font-publicSans"
         disabled={isPending}
        >
         <span className="font-semibold">Cancel</span>
        </Button>
       </div>
      </form>
     </Card>
    </div>
   </div>
  </div>
 );
};

export default SettingsPage;
