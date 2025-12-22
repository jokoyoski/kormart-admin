import { cn } from '@/lib/utils';

/**
 * DetailRow - Displays a label-value pair in detail views
 */
export const DetailRow = ({ label, value, mono = false }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray100 last:border-0">
    <span className="text-sm text-gray600">{label}</span>
    <span className={cn(
      "text-sm text-gray900 font-medium text-right max-w-[60%] break-words",
      mono && "font-mono text-xs"
    )}>
      {value || 'N/A'}
    </span>
  </div>
);

/**
 * BooleanBadge - Displays a yes/no badge based on boolean value
 */
export const BooleanBadge = ({ value, label }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray100 last:border-0">
    <span className="text-sm text-gray600">{label}</span>
    <span className={cn(
      "px-2.5 py-1 rounded-full text-xs font-medium",
      value ? 'bg-green-100 text-green-700' : 'bg-error50 text-error'
    )}>
      {value ? 'Yes' : 'No'}
    </span>
  </div>
);

/**
 * StatusBadge - Displays a status badge with configurable styling
 */
export const StatusBadge = ({ status, config }) => {
  if (!config) return null;
  
  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-xs font-medium",
      config.bg,
      config.color
    )}>
      {config.label}
    </span>
  );
};

/**
 * StatusBadgeWithIcon - Displays a status badge with an icon
 */
export const StatusBadgeWithIcon = ({ status, config }) => {
  if (!config) return null;
  
  const StatusIcon = config.icon;
  
  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-full",
      config.bg
    )}>
      <StatusIcon className={cn("w-5 h-5", config.color)} />
      <span className={cn("font-semibold text-sm", config.color)}>
        {config.label}
      </span>
    </div>
  );
};

