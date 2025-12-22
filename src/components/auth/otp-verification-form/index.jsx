import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '@/components/ui/button';
import OtpInput from '@/components/ui/otp-input';
import { useValidateOTP } from '@/api/auth/password-reset';
import { HiMiniArrowRight } from 'react-icons/hi2';

const OTPVerificationForm = () => {
 const navigate = useNavigate();
 const [searchParams] = useSearchParams();
 const [otp, setOtp] = useState('');
 const { mutate: validateOTP, isPending } = useValidateOTP();

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

 const handleOtpComplete = (value) => {
  setOtp(value);
  // Auto-submit when OTP is complete (all 6 digits filled)
  if (value.length === 6 && tempToken) {
   handleSubmitOtp(value);
  }
 };

 const handleSubmitOtp = (otpValue = otp) => {
  if (!tempToken) {
   toast.error('Invalid verification token');
   navigate('/login');
   return;
  }

  if (otpValue.length !== 6) {
   toast.error('Please enter a valid 6-digit OTP code');
   return;
  }

  validateOTP(
   { tempToken, otp: otpValue },
   {
    onSuccess: () => {
     // Encode token for URL
     const encodedToken = encodeURIComponent(tempToken);
     navigate(`/reset-password?token=${encodedToken}`);
    },
   },
  );
 };

 const handleSubmit = (e) => {
  e.preventDefault();
  handleSubmitOtp();
 };

 if (!tempToken) {
  return null; // Will redirect in useEffect
 }

 return (
  <div className="w-full h-fit max-w-md">
   <h2 className="font-outfit text-gray900 text-[23px] font-extrabold text-center leading-[140%] mb-6">
    Verify OTP
   </h2>
   <p className="text-sm text-center leading-[140%] text-gray80 mb-6">
    Enter the 6-digit code sent to your email address
   </p>

   <form onSubmit={handleSubmit}>
    <div className="space-y-6">
     <div className="flex justify-center">
      <OtpInput
       length={6}
       onComplete={handleOtpComplete}
       className="w-full"
      />
     </div>

     <Button
      type="submit"
      className="w-full rounded-[2px] text-sm leading-[140%] flex justify-center items-center gap-2 font-publicSans mt-6"
      isLoading={isPending}
      disabled={isPending || otp.length !== 6}
     >
      <span className="font-semibold">
       {isPending ? 'Verifying...' : 'Verify OTP'}
      </span>
      {!isPending && <HiMiniArrowRight className="text-black" />}
     </Button>

     <div className="w-full flex justify-center">
      <Link
       to="/login"
       className="text-sm text-secondary text-center w-fit font-outfit leading-[140%] hover:underline mt-3"
      >
       Back to Login
      </Link>
     </div>
    </div>
   </form>
  </div>
 );
};

export default OTPVerificationForm;

