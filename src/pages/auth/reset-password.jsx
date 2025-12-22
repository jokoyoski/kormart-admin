import ResetPasswordForm from '@/components/auth/reset-password-form';

const ResetPasswordPage = () => {
 return (
  <div className="w-full relative h-full bg-white p-5 md:p-10">
   {/* form */}
   <div className=" w-full h-full flex justify-center items-center ">
    <ResetPasswordForm />
   </div>
  </div>
 );
};

export default ResetPasswordPage;
