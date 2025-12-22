import { Outlet } from 'react-router-dom';

const EmptyLayout = () => {
 return (
  <div>
   <main>
    <Outlet />
   </main>
  </div>
 );
};

export default EmptyLayout;
