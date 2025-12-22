import ForgotPasswordForm from '@/components/auth/forgot-password-form';

const ForgotPasswordPage = () => {
 return (
  <div className="w-full relative h-full bg-white p-5 md:p-10">
   {/* form */}
   <div className=" w-full h-full flex justify-center items-center ">
    <ForgotPasswordForm />
   </div>
  </div>
 );
};

export default ForgotPasswordPage;
