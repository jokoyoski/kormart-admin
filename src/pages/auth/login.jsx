import LoginForm from '@/components/auth/login/login-form';

const LoginPage = () => {
 return (
  <div className="w-full relative h-full bg-white p-5 md:p-10">
   {/* form */}
   <div className=" w-full h-full flex justify-center items-center ">
    <LoginForm />
   </div>
  </div>
 );
};

export default LoginPage;
