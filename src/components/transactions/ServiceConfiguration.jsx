import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import Button from '@/components/ui/button';
import { useGetServiceCharges, useUpdateServiceCharge } from '@/api/transactions/service-charges';

const ServiceConfiguration = () => {
 const { data: chargesResponse, isLoading } = useGetServiceCharges();
 const updateCharge = useUpdateServiceCharge();

 const charges = chargesResponse?.data || {};

 const [formData, setFormData] = useState({
  uploadProduct: '',
  kormatShield: '',
 });

 useEffect(() => {
  if (charges.uploadProduct !== undefined || charges.kormatShield !== undefined) {
   setFormData({
    uploadProduct: charges.uploadProduct?.toString() || '',
    kormatShield: charges.kormatShield?.toString() || '',
   });
  }
 }, [charges]);

 const handleInputChange = (field, value) => {
  // Only allow numbers
  const numericValue = value.replace(/[^0-9]/g, '');
  setFormData((prev) => ({
   ...prev,
   [field]: numericValue,
  }));
 };

 const handleUpdateCharge = async (action) => {
  const amount = parseFloat(formData[action]);

  if (!amount || amount <= 0) {
   return;
  }

  try {
   await updateCharge.mutateAsync({
    action,
    amount,
   });
  } catch (error) {
   console.error('Error updating charge:', error);
  }
 };

 const getChargeLabel = (key) => {
  const labels = {
   uploadProduct: 'Upload Product Charge',
   kormatShield: 'Kormat Shield Charge',
  };
  return labels[key] || key;
 };

 return (
  <div className="w-full">
   <Card className="shadow-none rounded-[8px] bg-white py-4 w-full mt-5">
    <div className="px-4 md:px-7">
     <div className="pb-4 border-b border-[#D6DDEB] mb-5">
      <h3 className="text-[23px] font-extrabold text-[#3F3F3F] mb-1.5">
       Service Charges Configuration
      </h3>
      <p className="text-base text-[#939393]">
       Update service charges for upload product and kormat shield
      </p>
     </div>

     {isLoading ? (
      <div className="space-y-5">
       <div>
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-[50px] w-full" />
       </div>
       <div>
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-[50px] w-full" />
       </div>
      </div>
     ) : (
      <div className="space-y-5 md:space-y-6">
       {/* Upload Product Charge */}
       <div>
        <label className="block text-sm font-medium text-[#25324B] mb-2">
         {getChargeLabel('uploadProduct')}
        </label>
        <div className="flex gap-3">
         <Input
          type="text"
          placeholder="Enter amount"
          value={formData.uploadProduct}
          onChange={(e) =>
           handleInputChange('uploadProduct', e.target.value)
          }
          className="flex-1 !h-[50px] border border-gray-300 rounded-[4px] px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white p-2 text-sm leading-[140%]"
          disabled={updateCharge.isPending}
         />
         <Button
          type="button"
          onClick={() => handleUpdateCharge('uploadProduct')}
          disabled={
           updateCharge.isPending ||
           !formData.uploadProduct ||
           parseFloat(formData.uploadProduct) <= 0 ||
           parseFloat(formData.uploadProduct) === parseFloat(charges.uploadProduct)
          }
          className="h-[50px] px-5 bg-secondary hover:bg-secondary/90 text-black rounded-[10px] font-bold text-base leading-[17px]"
         >
          {updateCharge.isPending ? (
           <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating...
           </div>
          ) : (
           'Update'
          )}
         </Button>
        </div>
       </div>

       {/* Kormat Shield Charge */}
       <div>
        <label className="block text-sm font-medium text-[#25324B] mb-2">
         {getChargeLabel('kormatShield')}
        </label>
        <div className="flex gap-3">
         <Input
          type="text"
          placeholder="Enter amount"
          value={formData.kormatShield}
          onChange={(e) =>
           handleInputChange('kormatShield', e.target.value)
          }
          className="flex-1 !h-[50px] border border-gray-300 rounded-[4px] px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white p-2 text-sm leading-[140%]"
          disabled={updateCharge.isPending}
         />
         <Button
          type="button"
          onClick={() => handleUpdateCharge('kormatShield')}
          disabled={
           updateCharge.isPending ||
           !formData.kormatShield ||
           parseFloat(formData.kormatShield) <= 0 ||
           parseFloat(formData.kormatShield) === parseFloat(charges.kormatShield)
          }
          className="h-[50px] px-5 bg-secondary hover:bg-secondary/90 text-black rounded-[10px] font-bold text-base leading-[17px]"
         >
          {updateCharge.isPending ? (
           <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating...
           </div>
          ) : (
           'Update'
          )}
         </Button>
        </div>
       </div>
      </div>
     )}
    </div>
   </Card>
  </div>
 );
};

export default ServiceConfiguration;

