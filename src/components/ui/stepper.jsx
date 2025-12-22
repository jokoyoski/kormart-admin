import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

const CircleAnimation = ({
 isActive,
 isCompleted,
 size = 24,
 strokeWidth = 4,
}) => {
 const [showCheck, setShowCheck] = useState(isCompleted);
 const prevIsActive = useRef(isActive);
 const prevIsCompleted = useRef(isCompleted);

 useEffect(() => {
  // If transitioning from active to completed
  if (
   prevIsActive.current &&
   isCompleted &&
   !prevIsCompleted.current
  ) {
   // Delay showing the check mark until the circle animation completes
   setShowCheck(false);
   const timer = setTimeout(() => {
    setShowCheck(true);
   }, 600); // Slightly longer than the circle animation
   return () => clearTimeout(timer);
  } else if (isCompleted && !prevIsCompleted.current) {
   // If directly going to completed without being active first
   setShowCheck(true);
  }

  prevIsActive.current = isActive;
  prevIsCompleted.current = isCompleted;
 }, [isActive, isCompleted]);

 const radius = (size - strokeWidth) / 2;
 const circumference = 2 * Math.PI * radius;

 // Animation states
 const strokeDasharray = circumference;
 const strokeDashoffset = isActive || isCompleted ? 0 : circumference;

 return (
  <div
   className="relative flex items-center justify-center"
   style={{ width: size, height: size }}
  >
   {/* Background circle (always visible) */}
   {!isCompleted && (
    <svg
     width={size}
     height={size}
     className="absolute"
    >
     <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="transparent"
      stroke={isActive ? '#005FFF' : '#e0e7fe'}
      strokeWidth={strokeWidth}
      opacity={0.3}
     />
    </svg>
   )}

   {/* Animated circle */}
   <svg
    width={size}
    height={size}
    className="absolute"
   >
    <circle
     cx={size / 2}
     cy={size / 2}
     r={radius}
     fill={isCompleted ? '#005FFF' : 'transparent'}
     stroke={isActive || isCompleted ? '#005FFF' : '#e0e7fe'}
     strokeWidth={strokeWidth}
     strokeDasharray={strokeDasharray}
     strokeDashoffset={strokeDashoffset}
     transform="rotate(-90 12 12)"
     className="transition-all duration-700 ease-out"
     style={{
      transition:
       'stroke-dashoffset 0.7s ease-out, fill 0.3s ease-out',
     }}
    />
   </svg>

   {/* Check mark */}
   {isCompleted && showCheck && (
    <Check className="h-4 w-4 text-white z-10 animate-checkmark" />
   )}
  </div>
 );
};

const MobileCircleAnimation = ({
 isActive,
 isCompleted,
 size = 32,
 strokeWidth = 2,
}) => {
 const [showCheck, setShowCheck] = useState(isCompleted);
 const prevIsActive = useRef(isActive);
 const prevIsCompleted = useRef(isCompleted);

 useEffect(() => {
  // If transitioning from active to completed
  if (
   prevIsActive.current &&
   isCompleted &&
   !prevIsCompleted.current
  ) {
   // Delay showing the check mark until the circle animation completes
   setShowCheck(false);
   const timer = setTimeout(() => {
    setShowCheck(true);
   }, 600); // Slightly longer than the circle animation
   return () => clearTimeout(timer);
  } else if (isCompleted && !prevIsCompleted.current) {
   // If directly going to completed without being active first
   setShowCheck(true);
  }

  prevIsActive.current = isActive;
  prevIsCompleted.current = isCompleted;
 }, [isActive, isCompleted]);

 const radius = (size - strokeWidth) / 2;
 const circumference = 2 * Math.PI * radius;

 // Animation states
 const strokeDasharray = circumference;
 const strokeDashoffset = isActive || isCompleted ? 0 : circumference;

 return (
  <div
   className="relative flex items-center justify-center"
   style={{ width: size, height: size, minHeight: size }}
  >
   {/* Background circle (always visible) */}
   {!isCompleted && (
    <svg
     width={size}
     height={size}
     className="absolute"
    >
     <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="transparent"
      stroke={isActive ? '#005FFF' : '#e0e7fe'}
      strokeWidth={strokeWidth}
      opacity={0.3}
     />
    </svg>
   )}

   {/* Animated circle */}
   <svg
    width={size}
    height={size}
    className="absolute"
   >
    <circle
     cx={size / 2}
     cy={size / 2}
     r={radius}
     fill={isCompleted ? '#005FFF' : 'transparent'}
     stroke={isActive || isCompleted ? '#005FFF' : '#e0e7fe'}
     strokeWidth={strokeWidth}
     strokeDasharray={strokeDasharray}
     strokeDashoffset={strokeDashoffset}
     transform={`rotate(-90 ${size / 2} ${size / 2})`}
     className="transition-all duration-700 ease-out"
     style={{
      transition:
       'stroke-dashoffset 0.7s ease-out, fill 0.3s ease-out',
     }}
    />
   </svg>

   {/* Step number (only for inactive and active states) */}
   {!isCompleted && (
    <span
     className={cn(
      'absolute text-sm font-medium',
      isActive ? 'text-blue100' : 'text-[#e0e7fe]',
     )}
    >
     {/* This will be replaced with the actual step number */}
    </span>
   )}

   {/* Check mark */}
   {isCompleted && showCheck && (
    <Check className="h-5 w-5 text-white z-10 animate-checkmark" />
   )}
  </div>
 );
};

const Stepper = ({ steps, currentStep }) => {
 const prevStepRef = useRef(currentStep);

 // Track direction of step change for animations
 useEffect(() => {
  prevStepRef.current = currentStep;
 }, [currentStep]);

 return (
  <div className="w-full mb-8">
   {/* Desktop View */}
   <div className="md:flex items-center hidden">
    {steps.map((step, index) => {
     const isActive = currentStep === index;
     const isCompleted = currentStep > index;

     return (
      <div
       key={index}
       className={cn(
        'flex items-center transition-all duration-500 ease-in-out',
        isActive && 'scale-105',
       )}
      >
       {/* Circle with SVG animation */}
       <div
        className={cn(
         'flex items-center justify-center transition-all duration-500',
         // isActive && "shadow-[0_0_10px_rgba(0,95,255,0.3)]",
        )}
       >
        <CircleAnimation
         isActive={isActive}
         isCompleted={isCompleted}
         size={24}
         strokeWidth={4}
        />
       </div>

       {/* Step number */}
       <div className="ml-2 flex items-center">
        <span
         className={cn(
          'text-[34px] font-medium transition-all duration-500',
          isCompleted && 'text-[#32475CDE]',
          isActive && 'text-[#32475CDE]',
          !isActive && !isCompleted && 'text-[#32475C61]',
         )}
        >
         {index < 9 ? `0${index + 1}` : index + 1}
        </span>
       </div>

       {/* Title and subtitle */}
       <div className="ml-2">
        <div
         className={cn(
          'text-base leading-[175%] tracking-[0.15px] font-medium transition-all duration-500',
          isCompleted && 'text-text-primary',
          isActive && 'text-blue-main',
          !isActive && !isCompleted && 'text-gray-500',
         )}
        >
         {step.title}
        </div>
        <div
         className={cn(
          'text-xs leading-[14px] transition-all duration-500',
          isCompleted && 'text-text-primary',
          isActive && 'text-blue-main',
          !isActive && !isCompleted && 'text-gray-500',
         )}
        >
         {step.subtitle}
        </div>
       </div>

       {/* Connecting line with animation */}
       {index < steps.length - 1 && (
        <div className="mx-4 h-[3px] w-6 rounded-[40px] relative overflow-hidden">
         <div className="absolute inset-0 bg-[#e0e7fe]"></div>
         <div
          className={cn(
           'absolute inset-0 bg-blue100 transition-transform duration-700 ease-in-out',
           currentStep > index
            ? 'transform-none'
            : 'transform-gpu -translate-x-full',
          )}
         ></div>
        </div>
       )}
      </div>
     );
    })}
   </div>

   {/* Mobile View */}
   <div className="md:hidden mt-8">
    <div className="flex items-start justify-between">
     {steps.map((step, index) => {
      const isActive = currentStep === index;
      const isCompleted = currentStep > index;

      return (
       <div
        key={index}
        className={cn(
         'flex flex-col items-center flex-1 transition-all duration-500',
         isActive && 'transform-gpu scal-10',
        )}
       >
        {/* Step number/icon with connecting lines */}
        <div className="relative flex items-center justify-center w-full">
    

         {/* Step circle with SVG animation */}
         <div
          className={cn(
           'relative z-10 flex items-center justify-center transition-all duration-500',
           //  isActive && 'shadow-[0_0_10px_rgba(0,95,255,0.3)]',
          )}
         >
          <MobileCircleAnimation
           isActive={isActive}
           isCompleted={isCompleted}
           size={32}
           strokeWidth={3}
          />
          {!isCompleted && (
           <span
            className={cn(
             'absolute text-sm font-medium',
             isActive ? 'text-blue100' : 'text-gray-500',
            )}
           >
            {index + 1}
           </span>
          )}
         </div>

         {/* Connecting line with animation */}
         {index < steps.length - 1 && (
          <div className="mx-4 h-[3px] w-8 rounded-[40px] absolute overflow-hidden -right-6">
           <div className="absolute inset-0 bg-[#e0e7fe]"></div>
           <div
            className={cn(
             'absolute inset-0 bg-blue100 transition-transform duration-700 ease-in-out delay-500',
             currentStep > index
              ? 'transform-none'
              : 'transform-gpu -translate-x-full',
            )}
           ></div>
          </div>
         )}
        </div>

        {/* Step label */}
        <div className="mt-2 text-center">
         <div
          className={cn(
           'text-sm font-medium transition-all duration-500',
           isActive && 'text-blue-main',
           isCompleted && 'text-text-primary',
           !isActive && !isCompleted && 'text-gray-500',
          )}
         >
          {step.title}
         </div>
         <div
          className={cn(
           'text-xs leading-[14px] transition-all duration-500 md:block hidden',
           isCompleted && 'text-text-primary',
           isActive && 'text-blue-main',
           !isActive && !isCompleted && 'text-gray-500',
          )}
         >
          {step.subtitle}
         </div>
        </div>
       </div>
      );
     })}
    </div>
   </div>
  </div>
 );
};

export default Stepper;
