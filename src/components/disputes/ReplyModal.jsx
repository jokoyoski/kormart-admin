import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/button';
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useReplyDispute } from '@/api/disputes/reply-dispute';

const ReplyModal = ({
 isOpen,
 onClose,
 dispute,
 replyToMessage = null,
 initialContent = '',
}) => {
 const [targetedParticipants, setTargetedParticipants] = useState([]);
 const [content, setContent] = useState('');
 const [selectedOption, setSelectedOption] = useState('');
 const { mutate: replyDispute, isPending } = useReplyDispute();

 // Reset form when modal opens/closes
 useEffect(() => {
  if (!isOpen) {
   setContent(initialContent || '');
   setTargetedParticipants([]);
   setSelectedOption('');
  }
 }, [isOpen, initialContent]);

 // Auto-populate when replying to a specific message
 useEffect(() => {
  if (isOpen && replyToMessage) {
   // Set the sender as the targeted participant
   const senderId = replyToMessage.senderId;
   const buyerId =
    dispute?.order?.buyerId || dispute?.order?.buyer?.id;
   const sellerId =
    dispute?.order?.sellerId || dispute?.order?.seller?.id;

   if (senderId === buyerId) {
    setSelectedOption('buyer');
    setTargetedParticipants([buyerId]);
   } else if (senderId === sellerId) {
    setSelectedOption('seller');
    setTargetedParticipants([sellerId]);
   }
  } else if (isOpen && !replyToMessage) {
   // Clear selections when opening without replying to a specific message
   setSelectedOption('');
   setTargetedParticipants([]);
  }
 }, [isOpen, replyToMessage, dispute]);

 if (!isOpen || !dispute) return null;

 // Get buyer and seller IDs
 const buyerId = dispute?.order?.buyerId || dispute?.order?.buyer?.id;
 const sellerId =
  dispute?.order?.sellerId || dispute?.order?.seller?.id;
 const buyerName =
  dispute?.order?.buyer?.userDetails?.fullName ||
  dispute?.order?.buyer?.userDetails?.username ||
  dispute?.order?.buyer?.email ||
  'Buyer';
 const sellerName =
  dispute?.order?.seller?.userDetails?.fullName ||
  dispute?.order?.seller?.userDetails?.username ||
  dispute?.order?.seller?.email ||
  'Seller';

 const handleParticipantChange = (value) => {
  setSelectedOption(value);

  if (value === 'buyer') {
   setTargetedParticipants([buyerId]);
  } else if (value === 'seller') {
   setTargetedParticipants([sellerId]);
  } else if (value === 'both') {
   setTargetedParticipants([buyerId, sellerId]);
  } else {
   setTargetedParticipants([]);
  }
 };

 const handleSubmit = () => {
  if (!content.trim()) {
   return;
  }

  if (targetedParticipants.length === 0) {
   return;
  }

  const payload = {
   disputeId: dispute.id,
   messageType: 'text',
   content: content.trim(),
   targetedParticipants: targetedParticipants,
   ...(replyToMessage && { replyTo: replyToMessage.id }),
  };

  replyDispute(payload, {
   onSuccess: () => {
    setContent('');
    setTargetedParticipants([]);
    setSelectedOption('');
    onClose();
   },
  });
 };

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
   {/* Backdrop */}
   <div
    className="absolute inset-0 bg-black/20 backdrop-blur-sm"
    onClick={onClose}
   />

   {/* Modal */}
   <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
    {/* Close Button */}
    <button
     onClick={onClose}
     className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
    >
     <X className="h-5 w-5" />
    </button>

    {/* Content */}
    <div className="space-y-6">
     <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
       {replyToMessage ? 'Reply to Message' : 'Send Message'}
      </h2>
      <p className="text-gray-600">
       {replyToMessage
        ? 'Reply to this message from the participant'
        : 'Send a message to the buyer, seller, or both'}
      </p>
      {replyToMessage && (
       <div className="mt-3 p-3 bg-gray-50 rounded border border-[#E7E7E7]">
        <p className="text-xs text-[#939393] mb-1">Replying to:</p>
        <p className="text-sm text-[#3F3F3F]">
         {replyToMessage.content}
        </p>
       </div>
      )}
     </div>

     <div className="space-y-4">
      <div>
       <label className="block text-sm font-medium text-gray-700 mb-2">
        Who are you replying to{' '}
        <span className="text-red-500">*</span>
       </label>
       <Select
        value={selectedOption}
        onValueChange={handleParticipantChange}
        disabled={!!replyToMessage}
       >
        <SelectTrigger className="w-full">
         <SelectValue placeholder="Select recipient(s)" />
        </SelectTrigger>
        <SelectContent>
         <SelectItem value="buyer">{buyerName} (Buyer)</SelectItem>
         <SelectItem value="seller">{sellerName} (Seller)</SelectItem>
         <SelectItem value="both">
          Both ({buyerName} & {sellerName})
         </SelectItem>
        </SelectContent>
       </Select>
       {replyToMessage && (
        <p className="text-xs text-[#939393] mt-1">
         Recipient is automatically set based on the message
         you&apos;re replying to
        </p>
       )}
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-2">
        Message <span className="text-red-500">*</span>
       </label>
       <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your message..."
        rows={5}
        className="resize-none"
       />
      </div>
     </div>

     <div className="flex gap-3">
      <Button
       onClick={onClose}
       className="flex-1 border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700"
       disabled={isPending}
      >
       Cancel
      </Button>
      <Button
       onClick={handleSubmit}
       className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-3"
       disabled={
        isPending ||
        !content.trim() ||
        targetedParticipants.length === 0
       }
      >
       {isPending ? 'Sending...' : 'Send Reply'}
      </Button>
     </div>
    </div>
   </div>
  </div>
 );
};

export default ReplyModal;
