'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('GigFlow Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-textPrimary mb-4">
          Something went wrong!
        </h2>
        
        <p className="text-textSecondary mb-6">
          We encountered an error while loading GigFlow. This might be a temporary issue.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full btn-secondary"
          >
            Go Home
          </button>
        </div>
        
        {error.digest && (
          <p className="text-xs text-textSecondary mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
