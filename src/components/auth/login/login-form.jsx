import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import FormInput from '@/components/forms/form-input';
import Button from '@/components/ui/button';
import { loginSchema } from '@/utils/schemas';
import { useLoginMutation } from '@/api/auth/login';
import { HiMiniArrowRight } from 'react-icons/hi2';
import useAuthStore from '@/store/authStore';

// Form validation schema

const LoginForm = () => {
 const navigate = useNavigate();
 const { updateUserAndAuth, setAccessToken } = useAuthStore();
 const loginMutation = useLoginMutation();

 const {
  register,
  handleSubmit,
  formState: { errors },
 } = useForm({
  resolver: zodResolver(loginSchema),
  defaultValues: {
   email: '',
   password: '',
  },
 });

 const onSubmit = async (data) => {
  const payload = {
   email: data?.email,
   password: data.password,
   userType: 'admin',
  };
  try {
   const result = await loginMutation.mutateAsync(payload);
//    console.log({ result });
   const { token, ...user } = result;
   //    console.log({ access_token, refresh_token, user_details });
   updateUserAndAuth(user, true);
   setAccessToken(token);
   toast.success('Login Successful!!!');
   navigate('/dashboard');
  } catch (error) {
   const errorMessage =
    error.response?.data?.message ||
    'Login failed. Please try again.';
   console.log(errorMessage);
  }
 };

 const onError = (errors) => {
  console.error(errors);
  toast.error('Please check the form for errors');
 };

 return (
  <div className="w-full h-fit">
   <h2 className="font-outfit text-gray900 text-[23px] font-extrabold text-center leading-[140%] mb-6">
    Login to your account
   </h2>
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

     <FormInput
      label="Password"
      name="password"
      type="password"
      placeholder="Password"
      register={register}
      errors={errors}
      showPasswordToggle
      extraChildren={
       <Link
        to="/forgot-password"
        className="text-sm text-secondary font-outfit leading-[140%] hover:underline"
       >
        Forgot Password?
       </Link>
      }
     />
    </div>

    <Button
     type="submit"
     className="w-full rounded-[2px] text-sm  leading-[140%] flex justify-center items-center gap-2 font-publicSans mt-6
     "
     isLoading={loginMutation.isPending}
    >
     <span className="font-semibold">Login</span>
     <HiMiniArrowRight className="text-black" />
    </Button>
   </form>
  </div>
 );
};

export default LoginForm;
