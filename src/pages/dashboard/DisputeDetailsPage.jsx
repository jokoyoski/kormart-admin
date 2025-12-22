import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import {
 Avatar,
 AvatarFallback,
 AvatarImage,
} from '@/components/ui/avatar';
import { File, Mail, Phone, SendHorizonal } from 'lucide-react';
import ReplyModal from '@/components/disputes/ReplyModal';
import { BiSolidChevronRight } from 'react-icons/bi';
import { useGetDisputeDetails } from '@/api/disputes/get-disputes';
import Loading from '@/components/Loading';
import CustomConfirmModal from '@/components/modals/CustomConfirmModal';
import { useResolveDispute } from '@/api/disputes/reply-dispute';
import {
 formatDate,
 formatRelativeTime,
 formatCurrency,
} from '@/utils/format';
import { getUserName, getUserInitials } from '@/utils/user';
import { getDisputeStatusConfig } from '@/utils/statusConfigs';

const DisputeDetailsPage = () => {
 const { id } = useParams();
 const [showReplyModal, setShowReplyModal] = useState(false);
 const [replyToMessage, setReplyToMessage] = useState(null);
 const [openConfirmModal, setOpenConfirmModal] = useState(false);
 const [chatInput, setChatInput] = useState('');

 const resolveDispute = useResolveDispute(id);

 // Fetch dispute details (includes disputeChat with messages)
 const {
  data: disputeData,
  isLoading: isLoadingDispute,
  error: disputeError,
 } = useGetDisputeDetails(id);
 const dispute = disputeData?.data;

 // Sort messages by createdAt (oldest first, newest at bottom)
 const sortedMessages = dispute?.disputeChat?.messages
  ? [...dispute.disputeChat.messages].sort((a, b) => {
     return new Date(a.createdAt) - new Date(b.createdAt);
    })
  : [];

 const messages = sortedMessages;
 const participants = dispute?.disputeChat?.participants || [];

 // Helper function to find a message by ID
 const findMessageById = (messageId) => {
  return messages.find((m) => m.id === messageId);
 };

 const handleReplyToMessage = (message) => {
  setReplyToMessage(message);
  setShowReplyModal(true);
 };

 // Scroll to a message by ID
 const scrollToMessage = (messageId) => {
  const element = document.getElementById(`message-${messageId}`);
  if (element) {
   element.scrollIntoView({ behavior: 'smooth', block: 'center' });
   // Add a highlight effect
   element.classList.add('ring-2', 'ring-primary', 'ring-opacity-50');
   setTimeout(() => {
    element.classList.remove(
     'ring-2',
     'ring-primary',
     'ring-opacity-50',
    );
   }, 2000);
  }
 };

 // Get message sender info
 const getMessageSender = (message) => {
  // If senderId is null, it's an admin message
  if (!message.senderId) {
   return {
    name: 'Admin',
    avatar: '/user-avatar.png',
    initials: 'AD',
    isAdmin: true,
   };
  }

  // First, try to match with buyer/seller from order (they have full userDetails)
  const buyer = dispute?.order?.buyer;
  const seller = dispute?.order?.seller;

  if (buyer?.id === message.senderId) {
   const userDetails = buyer.userDetails || {};
   const name =
    userDetails.fullName ||
    userDetails.username ||
    buyer.email ||
    'Buyer';
   const avatar = userDetails.avatar || null;
   const parts = name.split(' ');
   const initials =
    parts.length >= 2
     ? (parts[0][0] + parts[1][0]).toUpperCase()
     : name.substring(0, 2).toUpperCase();

   return {
    name,
    avatar,
    initials,
    isAdmin: false,
    role: 'buyer',
   };
  }

  if (seller?.id === message.senderId) {
   const userDetails = seller.userDetails || {};
   const name =
    userDetails.fullName ||
    userDetails.username ||
    seller.email ||
    'Seller';
   const avatar = userDetails.avatar || null;
   const parts = name.split(' ');
   const initials =
    parts.length >= 2
     ? (parts[0][0] + parts[1][0]).toUpperCase()
     : name.substring(0, 2).toUpperCase();

   return {
    name,
    avatar,
    initials,
    isAdmin: false,
    role: 'seller',
   };
  }

  // Fallback to participant data
  const participant = participants.find(
   (p) => p.userId === message.senderId,
  );
  if (participant) {
   const user = participant.user || {};
   const name = user.email || `User (${participant.role})` || 'User';
   const parts = name.split(' ');
   const initials =
    parts.length >= 2
     ? (parts[0][0] + parts[1][0]).toUpperCase()
     : name.substring(0, 2).toUpperCase();

   return {
    name,
    avatar: null,
    initials,
    isAdmin: false,
    role: participant.role,
   };
  }

  return {
   name: 'User',
   avatar: null,
   initials: 'US',
   isAdmin: false,
  };
 };

 const renderMessageContent = (message) => {
  if (message.messageType === 'image') {
   // Check if content is a URL
   if (
    message.content.startsWith('http') ||
    message.content.startsWith('https')
   ) {
    return (
     <a
      className="mt-2"
      href={message.content}
      target="_blank"
      rel="noopener noreferrer"
     >
      <img
       src={message.content}
       alt="Dispute attachment"
       className="max-w-full h-auto rounded-lg max-h-[200px] object-cover border border-gray-200"
      />
     </a>
    );
   }
  }

  // For text messages, check for URLs and make them clickable
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = message.content.split(urlRegex);

  return (
   <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
    {parts.map((part, i) => {
     if (part.match(urlRegex)) {
      return (
       <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline break-all"
       >
        {part}
       </a>
      );
     }
     return part;
    })}
   </p>
  );
 };

 const handleConfirmAction = async () => {
  try {
   await resolveDispute.mutateAsync({});
   setOpenConfirmModal(false);
  } catch (error) {
   console.log(error);
   setOpenConfirmModal(false);
  }
 };

 // Show loading state
 if (isLoadingDispute) {
  return (
   <div className="w-full px-4 md:px-10 pt-4">
    <div className="flex justify-center items-center h-[400px]">
     <Loading />
    </div>
   </div>
  );
 }

 // Show error state
 if (disputeError || !dispute) {
  return (
   <div className="w-full px-4 md:px-10 pt-4">
    <div className="flex justify-center items-center h-[400px]">
     <h3 className="text-xl font-medium text-red-500">
      Error loading dispute. Please try again.
     </h3>
    </div>
   </div>
  );
 }

 return (
  <div className="w-full px-4 md:px-10">
   <div className="w-full pt-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10 md:mb-[50px]">
    <div>
     <h2 className="text-[20px] text-gray900 font-extrabold leading-[140%]">
      Disputes & support
     </h2>
     <div className="mt-1 flex items-center gap-1.5 text-sm text-[#50555C]">
      <Link
       to="/dashboard/disputes"
       className="cursor-pointer"
      >
       Ticket and support
      </Link>
      <BiSolidChevronRight />
      <span>View Details</span>
     </div>
    </div>

    <div className="flex items-center gap-2">
     <Button
      className="h-11 w-[157px] text-sm font-outfit font-semibold text-white cursor-pointer !bg-primary rounded-[10px] flex justify-center items-center"
      onClick={() => {
       setReplyToMessage(null);
       setShowReplyModal(true);
      }}
     >
      Send Message To
     </Button>

     {dispute.status !== 'resolved' && (
      <Button
       variant="outline"
       className="h-11 w-[157px] text-sm font-outfit font-semibold text-primary cursor-pointer !bg-transparent rounded-[10px] flex justify-center items-center"
       onClick={() => {
        setReplyToMessage(null);
        setOpenConfirmModal(true);
       }}
      >
       Resolve Dispute
      </Button>
     )}
    </div>
   </div>

   {/* Main Content */}
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
     <Card className="bg-white rounded-[4px] px-4 md:px-7 py-10 md:pt-[52px] md:pb-4">
      <div className="flex flex-col  mb-8 md:mb-10 gap-2">
       <div className="flex items-center gap-2">
        <div
         className={`size-[14px] rounded-full ${getDisputeStatusConfig(dispute.status).bg}`}
        ></div>
        <h3 className="font-semibold text-black">
         Dispute # {dispute.ticketNumber}
        </h3>
       </div>
       <span className="text-sm font-outfit pl-5 text-[#84818A]">
        Created {formatDate(dispute.createdAt)}
       </span>
      </div>

      <h4 className="text-lg font-bold text-black mb-3">
       {dispute.reason || 'Dispute'}
      </h4>
      {dispute.additionalInformation && (
       <p className="text-[#84818A] text-sm font-medium leading-relaxed mb-6">
        {dispute.additionalInformation}
       </p>
      )}

      {/* Display dispute documents if any */}
      {dispute.documents && dispute.documents.length > 0 && (
       <div className="mb-6">
        <h5 className="text-sm font-semibold text-black mb-3">
         Dispute Documents:
        </h5>
        <div className="flex flex-wrap gap-2">
         {dispute.documents.map((doc, index) => (
          <a
           key={index}
           href={doc}
           target="_blank"
           rel="noopener noreferrer"
           className="flex items-center gap-2 py-2 px-4 bg-white border border-[#D6DDEB] rounded-[4px] hover:bg-gray-50"
          >
           <File className="h-4 w-4 text-blue-600" />
           <span className="text-sm text-blue-600">
            Document {index + 1}
           </span>
          </a>
         ))}
        </div>
       </div>
      )}

      {/* Order Information */}
      {dispute.order && (
       <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-[#E7E7E7]">
        <h5 className="text-sm font-semibold text-black mb-4">
         Order Information
        </h5>
        <div className="grid grid-cols-2 gap-4">
         <div>
          <p className="text-xs text-[#939393] mb-1">Order ID</p>
          <p className="text-sm font-medium text-[#3F3F3F]">
           {dispute.order.orderId}
          </p>
         </div>
         <div>
          <p className="text-xs text-[#939393] mb-1">
           Transaction Reference
          </p>
          <p className="text-sm font-medium text-[#3F3F3F]">
           {dispute.order.transactionReference || 'N/A'}
          </p>
         </div>
         <div>
          <p className="text-xs text-[#939393] mb-1">Amount</p>
          <p className="text-sm font-medium text-[#3F3F3F]">
           {formatCurrency(dispute.order.agreedPrice)}
          </p>
         </div>
         <div>
          <p className="text-xs text-[#939393] mb-1">Order Status</p>
          <p className="text-sm font-medium text-[#3F3F3F] capitalize">
           {dispute.order.orderStatus}
          </p>
         </div>
         {dispute.order.deliveryInformation && (
          <div className="col-span-2">
           <p className="text-xs text-[#939393] mb-1">
            Delivery Information
           </p>
           <p className="text-sm font-medium text-[#3F3F3F]">
            {dispute.order.deliveryInformation}
           </p>
          </div>
         )}
        </div>
       </div>
      )}

      {/* Product Information */}
      {dispute.order?.product && (
       <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-[#E7E7E7]">
        <h5 className="text-sm font-semibold text-black mb-4">
         Product Information
        </h5>
        <div className="flex gap-4">
         {dispute.order.product.images &&
          dispute.order.product.images.length > 0 && (
           <img
            src={dispute.order.product.images[0]}
            alt={dispute.order.product.name}
            className="w-20 h-20 object-cover rounded"
           />
          )}
         <div className="flex-1">
          <p className="text-sm font-medium text-[#3F3F3F] mb-1">
           {dispute.order.product.name}
          </p>
          {dispute.order.product.description && (
           <p className="text-xs text-[#939393] line-clamp-2">
            {dispute.order.product.description}
           </p>
          )}
          <div className="flex gap-4 mt-2">
           <p className="text-xs text-[#939393]">
            Price:{' '}
            <span className="font-medium text-[#3F3F3F]">
             {formatCurrency(dispute.order.product.price)}
            </span>
           </p>
           {dispute.order.product.state && (
            <p className="text-xs text-[#939393]">
             Location:{' '}
             <span className="font-medium text-[#3F3F3F]">
              {dispute.order.product.state}
             </span>
            </p>
           )}
          </div>
         </div>
        </div>
       </div>
      )}

      {/* Messages Section */}
      <div className="mt-8">
       <h5 className="text-sm font-semibold text-black mb-4">
        Conversation
       </h5>
       {messages.length > 0 ? (
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
         {messages.map((message) => {
          const sender = getMessageSender(message);
          const isAdmin = sender.isAdmin;
          const repliedToMessage = message.replyTo
           ? findMessageById(message.replyTo)
           : null;
          const repliedToSender = repliedToMessage
           ? getMessageSender(repliedToMessage)
           : null;

          return (
           <div
            key={message.id}
            id={`message-${message.id}`}
            className="transition-all duration-200"
           >
            {!isAdmin ? (
             <div className="flex items-start gap-3 max-w-[85%] group pr-8">
              <Avatar className="!size-10 flex-shrink-0">
               <AvatarImage src={sender.avatar} />
               <AvatarFallback className="text-xs">
                {sender.initials}
               </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
               <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                 <span className="font-semibold text-[#25324B] text-sm">
                  {sender.name}
                  {sender.role && (
                   <span className="text-xs text-[#939393] ml-2 capitalize">
                    ({sender.role})
                   </span>
                  )}
                 </span>
                </div>
                <button
                 onClick={() => handleReplyToMessage(message)}
                 className="text-xs text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                 Reply
                </button>
               </div>

               {/* Show replied-to message preview */}
               {message.replyTo &&
                repliedToMessage &&
                repliedToSender && (
                 <button
                  onClick={() => scrollToMessage(message.replyTo)}
                  className="w-full text-left bg-gray-50/80 border-l-3 border-primary/40 rounded-r px-3 py-2 mb-2 hover:bg-gray-100 hover:border-primary/60 transition-all cursor-pointer group/reply"
                 >
                  <div className="flex items-center gap-2 mb-1">
                   <svg
                    className="w-3 h-3 text-primary/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                   >
                    <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                   </svg>
                   <span className="text-xs font-medium text-[#646464]">
                    {repliedToSender.name}
                   </span>
                  </div>
                  <p className="text-xs text-[#7C8493] line-clamp-2 group-hover/reply:text-[#3F3F3F] transition-colors">
                   {repliedToMessage.content}
                  </p>
                 </button>
                )}

               {message.messageType === 'file' ? (
                <div className="flex items-center gap-3 py-3 px-4 bg-white border border-[#D6DDEB] rounded-[4px]">
                 <File className="h-5 w-5 text-blue-600" />
                 <span className="text-blue-600 font-medium text-sm">
                  File Attachment
                 </span>
                </div>
               ) : (
                <div className="bg-white border border-[#D6DDEB] rounded-lg px-4 py-3">
                 {renderMessageContent(message)}
                </div>
               )}

               <div className="flex items-center gap-3 mt-1">
                <p className="text-xs text-[#7C8493]">
                 {formatRelativeTime(message.createdAt)}
                </p>
                {message.targetedParticipants &&
                 message.targetedParticipants.length > 0 && (
                  <>
                   <span className="text-xs text-[#D6DDEB]">•</span>
                   <p className="text-xs text-[#939393]">
                    To:{' '}
                    {message.targetedParticipants
                     .map((p) => p.role)
                     .join(', ')}
                   </p>
                  </>
                 )}
               </div>
              </div>
             </div>
            ) : (
             <div className="flex items-start gap-3 justify-end pl-8">
              <div className="flex-1 flex flex-col items-end max-w-[85%] min-w-0">
               <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[#25324B] text-sm">
                 {sender.name}
                </span>
               </div>

               {/* Show replied-to message preview */}
               {message.replyTo &&
                repliedToMessage &&
                repliedToSender && (
                 <button
                  onClick={() => scrollToMessage(message.replyTo)}
                  className="w-full text-left bg-primary/5 border-r-3 border-primary/40 rounded-l px-3 py-2 mb-2 hover:bg-primary/10 hover:border-primary/60 transition-all cursor-pointer group/reply"
                 >
                  <div className="flex items-center gap-2 mb-1 justify-end">
                   <span className="text-xs font-medium text-[#646464]">
                    {repliedToSender.name}
                   </span>
                   <svg
                    className="w-3 h-3 text-primary/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                   >
                    <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                   </svg>
                  </div>
                  <p className="text-xs text-[#7C8493] line-clamp-2 text-right group-hover/reply:text-[#3F3F3F] transition-colors">
                   {repliedToMessage.content}
                  </p>
                 </button>
                )}

               <div className="bg-[#F8F8FD] rounded-lg rounded-tr-none px-4 py-3 text-[#515B6F]">
                {renderMessageContent(message)}
               </div>

               <div className="flex items-center gap-3 mt-1">
                {message.targetedParticipants &&
                 message.targetedParticipants.length > 0 && (
                  <>
                   <p className="text-xs text-[#939393]">
                    To:{' '}
                    {message.targetedParticipants
                     .map((p) => p.role)
                     .join(', ')}
                   </p>
                   <span className="text-xs text-[#D6DDEB]">•</span>
                  </>
                 )}
                <p className="text-xs text-[#7C8493]">
                 {formatRelativeTime(message.createdAt)}
                </p>
               </div>
              </div>
              <Avatar className="h-10 w-10 flex-shrink-0">
               <AvatarImage src={sender.avatar} />
               <AvatarFallback className="text-xs">
                {sender.initials}
               </AvatarFallback>
              </Avatar>
             </div>
            )}
           </div>
          );
         })}
        </div>
       ) : (
        <div className="flex justify-center items-center h-[200px] border border-dashed border-[#E7E7E7] rounded-lg">
         <p className="text-gray-500">No messages yet</p>
        </div>
       )}
      </div>

      {/* Chat Input Area */}
      <div className="mt-6 pt-4 border-t border-[#E7E7E7]">
       <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-[#E7E7E7] focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
        <input
         type="text"
         value={chatInput}
         onChange={(e) => setChatInput(e.target.value)}
         placeholder="Type your message here..."
         className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-[#3F3F3F] placeholder:text-[#939393] px-2 outline-none"
         onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
           e.preventDefault();
           if (chatInput.trim()) {
            setReplyToMessage(null);
            setShowReplyModal(true);
           }
          }
         }}
        />
        <Button
         className=" p-0 rounded-lg bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors cursor-pointer"
         onClick={() => {
          setReplyToMessage(null);
          setShowReplyModal(true);
         }}
         disabled={!chatInput.trim()}
        >
         <SendHorizonal className=" text-white" />
        </Button>
       </div>
      </div>
     </Card>
    </div>

    {/* Right Column - Sidebar */}
    <div className="lg:col-span-1">
     <Card className="bg-white rounded-[4px] px-4 md:px-6 py-6 sticky top-4">
      {/* Buyer Information */}
      {dispute.order?.buyer && (
       <div className="mb-6 pb-6 border-b border-[#E7E7E7]">
        <h5 className="text-sm font-semibold text-black mb-4">
         Buyer Information
        </h5>
        <div className="flex items-start gap-3 mb-4">
         <Avatar className="size-12">
          <AvatarImage
           src={dispute.order.buyer.userDetails?.avatar}
          />
          <AvatarFallback>
           {getUserInitials(dispute.order.buyer)}
          </AvatarFallback>
         </Avatar>
         <div className="flex-1">
          <p className="text-sm font-medium text-[#3F3F3F]">
           {getUserName(dispute.order.buyer)}
          </p>
          {dispute.order.buyer.userDetails?.username && (
           <p className="text-xs text-[#939393]">
            @{dispute.order.buyer.userDetails.username}
           </p>
          )}
         </div>
        </div>
        <div className="space-y-2">
         {dispute.order.buyer.userDetails?.telephone && (
          <div className="flex items-center gap-2 text-xs text-[#939393]">
           <Phone className="h-3 w-3" />
           <span>{dispute.order.buyer.userDetails.telephone}</span>
          </div>
         )}
         {dispute.order.buyer.email && (
          <div className="flex items-center gap-2 text-xs text-[#939393]">
           <Mail className="h-3 w-3" />
           <span>{dispute.order.buyer.email}</span>
          </div>
         )}
        </div>
       </div>
      )}

      {/* Seller Information */}
      {dispute.order?.seller && (
       <div className="mb-6 pb-6 border-b border-[#E7E7E7]">
        <h5 className="text-sm font-semibold text-black mb-4">
         Seller Information
        </h5>
        <div className="flex items-start gap-3 mb-4">
         <Avatar className="size-12">
          <AvatarImage
           src={dispute.order.seller.userDetails?.avatar}
          />
          <AvatarFallback>
           {getUserInitials(dispute.order.seller)}
          </AvatarFallback>
         </Avatar>
         <div className="flex-1">
          <p className="text-sm font-medium text-[#3F3F3F]">
           {getUserName(dispute.order.seller)}
          </p>
          {dispute.order.seller.userDetails?.username && (
           <p className="text-xs text-[#939393]">
            @{dispute.order.seller.userDetails.username}
           </p>
          )}
         </div>
        </div>
        <div className="space-y-2">
         {dispute.order.seller.userDetails?.telephone && (
          <div className="flex items-center gap-2 text-xs text-[#939393]">
           <Phone className="h-3 w-3" />
           <span>{dispute.order.seller.userDetails.telephone}</span>
          </div>
         )}
         {dispute.order.seller.email && (
          <div className="flex items-center gap-2 text-xs text-[#939393]">
           <Mail className="h-3 w-3" />
           <span>{dispute.order.seller.email}</span>
          </div>
         )}
        </div>
       </div>
      )}

      {/* Raised By */}
      {dispute.user && (
       <div>
        <h5 className="text-sm font-semibold text-black mb-4">
         Raised By
        </h5>
        <div className="flex items-start gap-3">
         <Avatar className="size-10">
          <AvatarImage src={dispute.user.userDetails?.avatar} />
          <AvatarFallback>
           {getUserInitials(dispute.user)}
          </AvatarFallback>
         </Avatar>
         <div className="flex-1">
          <p className="text-sm font-medium text-[#3F3F3F]">
           {getUserName(dispute.user)}
          </p>
          {dispute.user.userDetails?.username && (
           <p className="text-xs text-[#939393]">
            @{dispute.user.userDetails.username}
           </p>
          )}
         </div>
        </div>
       </div>
      )}
     </Card>
    </div>
   </div>

   {/* Reply Modal */}
   <ReplyModal
    isOpen={showReplyModal}
    onClose={() => {
     setShowReplyModal(false);
     setReplyToMessage(null);
    }}
    dispute={dispute}
    replyToMessage={replyToMessage}
    initialContent={chatInput}
   />

   <CustomConfirmModal
    open={openConfirmModal}
    setOpen={setOpenConfirmModal}
    title={'Are You Sure?'}
    secondaryBtnText={'Resolve'}
    actionType={'default'}
    onSecondaryBtnClick={handleConfirmAction}
    isLoading={resolveDispute.isPending}
   >
    <p className="text-sm text-gray-600">
     {'Are you sure you want to resolve this dispute?'}
    </p>
   </CustomConfirmModal>
  </div>
 );
};

export default DisputeDetailsPage;
