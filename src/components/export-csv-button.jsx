import Button from '@/components/ui/button';
import { Download } from 'lucide-react';

function ExportCsvButton({ mutation, buttonText = 'Export as CSV', className = '' }) {
  const handleExportCSV = () => {
    mutation.mutate();
  };

  return (
    <Button
      variant="outline"
      onClick={handleExportCSV}
      disabled={mutation.isPending}
      className={`h-12 w-[160px] flex items-center justify-center gap-1 bg-white border-[#B8C9C9] text-[#202430] ${className}`}
    >
      <span className="font-bold leading-[150%] text-sm">
        {mutation.isPending ? 'Exporting...' : buttonText}
      </span>
      <Download className="h-4 w-4 text-[#0339F8]" />
    </Button>
  );
}

export default ExportCsvButton;
