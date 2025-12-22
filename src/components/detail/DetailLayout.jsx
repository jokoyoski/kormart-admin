import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * BackButton - Reusable back button component
 */
export const BackButton = ({ onClick, label = 'Back' }) => (
  <div className="flex items-center gap-4 mb-6">
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Button>
  </div>
);

/**
 * ErrorState - Reusable error state component
 */
export const ErrorState = ({ 
  title, 
  message, 
  backButtonLabel, 
  onBack, 
  backButtonText = 'Back'
}) => (
  <div className="w-full px-4 md:px-10">
    <div className="w-full pt-4">
      <BackButton onClick={onBack} label={backButtonLabel || backButtonText} />
      
      <Card className="p-8 text-center border-error50 bg-error50/30">
        <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray900 mb-2">{title}</h3>
        <p className="text-gray600 mb-4">
          {message}
        </p>
        <Button onClick={onBack}>
          {backButtonLabel || backButtonText}
        </Button>
      </Card>
    </div>
  </div>
);

/**
 * LoadingState - Reusable loading skeleton component
 */
export const LoadingState = () => (
  <div className="space-y-4">
    <Card className="p-6">
      <Skeleton className="h-32 w-full" />
    </Card>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-6">
        <Skeleton className="h-48 w-full" />
      </Card>
      <Card className="p-6">
        <Skeleton className="h-48 w-full" />
      </Card>
    </div>
  </div>
);

/**
 * DetailPageLayout - Wrapper component for detail pages
 */
export const DetailPageLayout = ({ children }) => (
  <div className="w-full px-4 md:px-10">
    <div className="w-full pt-4 pb-8">
      {children}
    </div>
  </div>
);

