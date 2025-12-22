import OTPVerificationForm from '@/components/auth/otp-verification-form';

const OTPVerificationPage = () => {
 return (
  <div className="w-full relative h-full bg-white p-5 md:p-10">
   {/* form */}
   <div className=" w-full h-full flex justify-center items-center ">
    <OTPVerificationForm />
   </div>
  </div>
 );
};

export default OTPVerificationPage;

