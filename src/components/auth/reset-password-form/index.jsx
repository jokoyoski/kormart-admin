import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/button';
import { resetPasswordSchema } from '@/utils/schemas';
import FormInput from '@/components/forms/form-input';
import { useChangePassword } from '@/api/auth/password-reset';
import { HiMiniArrowRight } from 'react-icons/hi2';
import { Shield } from 'lucide-react';

const ResetPasswordForm = () => {
 const navigate = useNavigate();
 const [searchParams] = useSearchParams();
 const { mutate: changePassword, isPending } = useChangePassword();

 // Get tempToken from URL and decode it
 const tempToken = searchParams.get('token')
  ? decodeURIComponent(searchParams.get('token'))
  : null;

 // Redirect to login if token is missing
 useEffect(() => {
  if (!tempToken) {
   toast.error('Invalid or missing verification token');
   navigate('/login');
  }
 }, [tempToken, navigate]);

 const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
 } = useForm({
  resolver: zodResolver(resetPasswordSchema),
  defaultValues: {
   password: '',
   confirmPassword: '',
  },
 });

 const onSubmit = async (data) => {
  if (!tempToken) {
   toast.error('Invalid verification token');
   navigate('/login');
   return;
  }

  changePassword(
   {
    tempToken,
    newPassword: data.password,
    confirmPassword: data.confirmPassword,
   },
   {
    onSuccess: () => {
     reset();
     navigate('/login');
    },
   },
  );
 };

 if (!tempToken) {
  return null; // Will redirect in useEffect
 }

 const onError = (errors) => {
  console.error(errors);
  toast.error('Please check the form for errors');
 };

 return (
  <div className="w-full h-fit">
   <h2 className="font-outfit text-gray900 text-[23px] font-extrabold text-center leading-[140%] mb-2">
    Reset Password
   </h2>
   <p className="text-sm text-center leading-[140%] text-gray80 mb-2">
    Enter new password
   </p>
   <form onSubmit={handleSubmit(onSubmit, onError)}>
    <div className="space-y-4">
     <FormInput
      label="Password"
      name="password"
      type="password"
      placeholder="Password"
      register={register}
      errors={errors}
      showPasswordToggle
     />
     <FormInput
      label="Confirm Password"
      name="confirmPassword"
      type="password"
      placeholder="Confirm Password"
      register={register}
      errors={errors}
      showPasswordToggle
     />
    </div>



    <Button
     type="submit"
     className="w-full rounded-[2px] text-sm leading-[140%] flex justify-center items-center gap-2 font-publicSans mt-6"
     isLoading={isPending}
     disabled={isPending}
    >
     <span className="font-semibold">
      {isPending ? 'Resetting Password...' : 'Reset Password'}
     </span>
     {!isPending && <HiMiniArrowRight className="text-black" />}
    </Button>
    <div className="w-full flex justify-center">
     <Link
      to="/login"
      className="text-sm text-secondary text-center w-fit  font-outfit leading-[140%] hover:underline mt-3"
     >
      Back to Login
     </Link>
    </div>
   </form>
  </div>
 );
};

export default ResetPasswordForm;
