import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/button';
import { forgotPasswordSchema } from '@/utils/schemas';
import { useSendOTP } from '@/api/auth/password-reset';
import FormInput from '@/components/forms/form-input';
import { HiMiniArrowRight } from 'react-icons/hi2';

const ForgotPasswordForm = () => {
 const navigate = useNavigate();
 const { mutate: sendOTP, isPending } = useSendOTP();

 const {
  register,
  handleSubmit,
  formState: { errors },
 } = useForm({
  resolver: zodResolver(forgotPasswordSchema),
  defaultValues: {
   email: '',
  },
 });

 const onSubmit = async (data) => {
  sendOTP(data.email, {
   onSuccess: (response) => {
    // Extract token from response data - response structure: { status, statusCode, message, data: "token" }
    const tempToken = response?.data;
    if (tempToken) {
     // Encode token for URL
     const encodedToken = encodeURIComponent(tempToken);
     navigate(`/otp-verification?token=${encodedToken}`);
    } else {
     toast.error('Failed to receive OTP token. Please try again.');
    }
   },
  });
 };

 const onError = (errors) => {
  console.error(errors);
  toast.error('Please check the form for errors');
 };

 return (
  <div className="w-full h-fit">
   <h2 className="font-outfit text-gray900 text-[23px] font-extrabold text-center leading-[140%] mb-6">
    Forget Password
   </h2>
   <p className="text-sm text-center leading-[140%] text-gray80 mb-6">
    Kindly enter the email address linked to this account and we will
    send you a code to enable you change your password.
   </p>
   <form onSubmit={handleSubmit(onSubmit, onError)}>
    <div className="space-y-4">
     <FormInput
      label="Email"
      name="email"
      type="email"
      placeholder="Email"
      register={register}
      errors={errors}
     />
    </div>

    <Button
     type="submit"
     className="w-full rounded-[2px] text-sm  leading-[140%] flex justify-center items-center gap-2 font-publicSans mt-6"
     isLoading={isPending}
     disabled={isPending}
    >
     <span className="font-semibold">
      {isPending ? 'Sending OTP...' : 'Send OTP'}
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

export default ForgotPasswordForm;
