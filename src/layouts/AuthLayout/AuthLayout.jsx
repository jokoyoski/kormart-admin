import { Outlet } from 'react-router-dom';
const AuthLayout = ({ withOutlet = true, children }) => {
 return (
  <div className=" min-h-screen h-full w-full bg-background flex flex-col">
   {/* header */}
   <div className="bg-white py-[29px] px-4">
    <div className="mx-auto max-w-[1200px] flex items-center justify-between">
     <img
      src="/logo.png"
      alt="Logo"
      className="w-[117px] h-[38px] object-contain"
     />

     <p className="text-[#000302] font-outfit">Learn More</p>
    </div>
   </div>
   <div className="w-full h-full justify-center items-center flex flex-1 px-4">
    <div className="h-[440px] w-full mx-auto max-w-[1008px] shadow-[0px_12px_48px_0px_#191B1C08] rounded-[8px] grid grid-cols-1 md:grid-cols-2 overflow-hidden">
     <div className="w-full h-full hidden md:block">
      <img
       src="/auth-img.png"
       alt="Auth Image"
       className="w-full h-full object-cover"
      />
     </div>
     <div>{withOutlet ? <Outlet /> : children}</div>
    </div>
   </div>
  </div>
 );
};

export default AuthLayout;
