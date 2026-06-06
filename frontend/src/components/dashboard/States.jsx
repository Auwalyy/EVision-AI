import { Zap, AlertCircle } from 'lucide-react';

export function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 border-4 border-ev-blue/30 border-t-ev-blue rounded-full animate-spin" />
      <p className="text-ev-gray text-sm">{text}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <AlertCircle size={40} className="text-red-400" />
      <p className="text-white font-medium">{message || 'Something went wrong'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary text-sm">
          <Zap size={14} /> Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message = 'No data available' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Zap size={40} className="text-ev-dark-border" />
      <p className="text-ev-gray">{message}</p>
    </div>
  );
}
