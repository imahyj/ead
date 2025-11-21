import React from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  status: string;
  progress: number; // 0 to 100
}

export const ProgressBar: React.FC<Props> = ({ status, progress }) => {
  return (
    <div className="w-full max-w-md mx-auto mt-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-3 text-sky-600">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="font-semibold text-lg">{status}</span>
      </div>
      <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-sky-400 rounded-full transition-all duration-500 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 animate-pulse"></div>
        </div>
      </div>
      <p className="text-sm text-slate-400 mt-2 italic">This requires AI thinking, please wait roughly 30-60 seconds...</p>
    </div>
  );
};