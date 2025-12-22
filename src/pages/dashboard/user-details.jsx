import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { BiSolidChevronRight } from 'react-icons/bi';
import DataTable from '@/components/ui/data-table';
import DeleteAccountModal from '@/components/DeleteAccountModal';
import img from '@/assets/Avatar.png';
import { FaCheck } from 'react-icons/fa';
// Mock user data - replace with actual data fetching
const userData = {
 id: 1,
 avatar: img,
 name: 'Seth Hallam',
 completionPercentage: '1.23%',
 completionText: 'Completed Order',
 username: 'Just4you',
 fullName: 'Justin Timberlake',
 phoneNumber: '09056578943',
 email: 'Lagos',
};

// Mock history data
const historyData = [
 {
  id: 1,
  product: 'SOLAPE SHOES Sandals',
  date: '12-03-24',
  amount: '#30,000',
  region: 'Lagos',
  status: 'Ongoing',
  activity: 'Buy',
 },
 {
  id: 2,
  product: 'SOLAPE SHOES Sandals',
  date: '12-03-24',
  amount: '#30,000',
  region: 'Lagos',
  status: 'Ongoing',
  activity: 'Buy',
 },
 {
  id: 3,
  product: 'SOLAPE SHOES Sandals',
  date: '12-03-24',
  amount: '#30,000',
  region: 'Lagos',
  status: 'Ongoing',
  activity: 'Sell',
 },
 {
  id: 4,
  product: 'SOLAPE SHOES Sandals',
  date: '12-03-24',
  amount: '#30,000',
  region: 'Lagos',
  status: 'Ongoing',
  activity: 'Buy',
 },
];

const UserDetailsPage = () => {
 const { id } = useParams();
 const [searchFilter, setSearchFilter] = useState('');
 const [showDeleteModal, setShowDeleteModal] = useState(false);

 // History table columns
 const historyColumns = [
  {
   header: 'Product',
   accessor: 'product',
   enableSorting: false,
   cell: (info) => {
    return (
     <span className="block min-w-[150px] text-[#32475CDE]">{info.getValue()}</span>
    );
   },
  },
  {
   header: 'DATE',
   accessor: 'date',
   enableSorting: false,
   cell: (info) => {
    return <span className='text-[#50555C]'>{info.getValue()}</span>;
   },
  },
  {
   header: 'Amount',
   accessor: 'amount',
   enableSorting: false,
   cell: (info) => {
    return <span className='text-[#50555C]'>{info.getValue()}</span>;
   },
  },
  {
   header: 'REGION',
   accessor: 'region',
   enableSorting: false,
   cell: (info) => {
    return <span className='text-[#50555C]'>{info.getValue()}</span>;
   },
  },
  {
   header: 'STATUS',
   accessor: 'status',
   enableSorting: false,
   cell: (info) => {
    const value = info.getValue();
    return (
     <div className="w-[91px] h-[30px] rounded-[130px] text-sm font-semibold leading-[140%] flex items-center justify-center bg-primary50 text-primary500">
      {value}
     </div>
    );
   },
  },
  {
   header: 'ACTIVITY',
   accessor: 'activity',
   enableSorting: false,
   cell: (info) => {
    return <span className='text-[#50555C]'>{info.getValue()}</span>;
   },
  },
 ];

 return (
  <div className="w-full px-4 md:px-10">
   <div className="w-full pt-4">
    <div>
     <h2 className="text-[20px] text-gray900 font-extrabold leading-[140%]">
      User Management
     </h2>
     <div className="mt-1 flex items-center gap-1.5 text-sm text-[#50555C]">
      <Link
       to="/dashboard/user-management"
       className="cursor-pointer"
      >
       User management
      </Link>
      <BiSolidChevronRight />
      <span>View Details</span>
     </div>
    </div>
   </div>

   <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-3">
    {/* User Profile Card */}
    <div className="lg:col-span-4">
     <Card className="cus_shadow rounded-[8px] bg-white pt-[60px] pb-6">
      {/* User Avatar and Name */}
      <div className="flex flex-col items-center text-center mb-6">
       <div className="w-[120px] h-[120px] rounded-[12px] overflow-hidden mb-4">
        <img
         src={userData.avatar || '/placeholder.svg'}
         alt={userData.name}
         className="w-full h-full object-cover"
        />
       </div>
       <h3 className="text-[20px] font-semibold text-[#646464] mb-6">
        {userData.name}
       </h3>
       <div className="flex items-center gap-2.5 text-sm text-gray600">
        <div className="size-11 bg-[#2B39901F] rounded-[8px]  flex items-center justify-center">
         <FaCheck className="size-[18px] text-[#2B3990]" />
        </div>
        <div className="flex flex-col items-start">
         <span className="font-semibold font-outfit text-[#50555C]">
          {userData.completionPercentage}
         </span>
         <span className="text-sm text-[#646464]">
          {userData.completionText}
         </span>
        </div>
       </div>
      </div>

      {/* Details Section */}
      <div className="pb-4 border-b border-gray-300 mb-6">
       <h4 className="text-[16px] font-semibold font-outfit text-[#646464] px-2">
        Details
       </h4>
      </div>
      <div className="">
       <div className="max-w-[235px] mx-auto space-y-5">
        <div className="flex items-center gap-2">
         <span className="text-base text-[#50555C] font-semibold font-outfit">
          Username:
         </span>
         <p className="text-base font-medium text-[#50555CCC] ">
          {userData.username}
         </p>
        </div>

        <div className="flex items-center gap-2">
         <span className="text-base text-[#50555C] font-semibold font-outfit">
          Full Name:
         </span>
         <p className="text-base font-medium text-[#50555CCC] ">
          {userData.fullName}
         </p>
        </div>

        <div className="flex items-center gap-2">
         <span className="text-base text-[#50555C] font-semibold font-outfit">
          Phone number:
         </span>
         <p className="text-base font-medium text-[#50555CCC] ">
          {userData.phoneNumber}
         </p>
        </div>

        <div className="flex items-center gap-2">
         <span className="text-base text-[#50555C] font-semibold font-outfit">
          Email:
         </span>
         <p className="text-base font-medium text-[#50555CCC] ">
          {userData.email}
         </p>
        </div>
       </div>

       {/* Delete Button */}
       <button
        onClick={() => setShowDeleteModal(true)}
        className="w-[161px] mx-auto flex justify-center items-center mt-6  h-[34px] border border-error500 text-error500 rounded-[6px] text-sm font-semibold hover:bg-error50 transition-colors"
       >
        DELETE ACCOUNT
       </button>
      </div>
     </Card>
    </div>

    {/* History Section */}
    <div className="lg:col-span-8">
     <Card className="cus_shadow rounded-[8px] bg-white ">
      <div className="flex items-center justify-between p-4 md:p-6">
       <h4 className="text-[20px] font-medium text-[#32475CDE]">History</h4>

       <div className="relative w-full max-w-[220px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
         placeholder="Search Event"
         value={searchFilter}
         onChange={(e) => setSearchFilter(e.target.value)}
         className="pl-9 w-full bg-white h-[38px] border border-[#D3D3D3] rounded-[8px] focus:ring-none text-gray900 text-sm placeholder:text-gray400"
        />
       </div>
      </div>

      <div>
       <DataTable
        tableColumns={historyColumns}
        tableData={historyData || []}
        enableGlobalFilter={true}
        enablePagination={true}
        showPagination={true}
        showSearch={false}
        perPageOptions={[10, 20, 30, 50]}
        emptyHeading="No history found"
        emptySubtitle="There are no transactions matching your search criteria."
        tableClassName="!min-w-[700px]"
        loading={false}
        serverSidePagination={false}
        manualPagination={true}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
       />
      </div>
     </Card>
    </div>
   </div>

   {/* Delete Modal */}
   <DeleteAccountModal
    isOpen={showDeleteModal}
    onClose={() => setShowDeleteModal(false)}
    onConfirm={() => {
     // Handle delete logic here
     console.log('Delete confirmed');
     setShowDeleteModal(false);
    }}
   />
  </div>
 );
};

export default UserDetailsPage;
