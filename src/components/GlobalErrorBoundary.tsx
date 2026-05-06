import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center font-mono">
      <div className="max-w-md w-full glass-panel border border-red-500/30 p-8 rounded-xl shadow-[0_0_50px_rgba(239,68,68,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
        
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-6" />
        
        <h1 className="text-xl font-bold text-[#e0e0e0] uppercase tracking-widest mb-2">
          System Failure
        </h1>
        
        <p className="text-sm text-[#888] mb-6 leading-relaxed">
          A critical exception occurred in the UI thread. The application state may be compromised.
        </p>

        <div className="bg-[#000] p-4 rounded-lg border border-[#1a1a1a] text-left overflow-x-auto mb-8">
          <code className="text-xs text-red-400 whitespace-pre-wrap break-all">
            {error instanceof Error ? error.message : String(error) || 'Unknown internal error'}
          </code>
        </div>

        <button
          onClick={() => {
            resetErrorBoundary();
            window.location.reload();
          }}
          className="elite-btn px-6 py-3 rounded-lg flex items-center justify-center gap-3 w-full"
        >
          <RefreshCw className="w-4 h-4" />
          <span>REBOOT SYSTEM</span>
        </button>
      </div>
    </div>
  );
}

export function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}
