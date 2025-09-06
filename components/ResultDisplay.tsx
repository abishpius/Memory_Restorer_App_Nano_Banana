import React, { useState } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultDisplayProps {
  originalImage: string;
  restoredImage: string;
  onReset: () => void;
  onTune: (prompt: string) => void;
  isLoading: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImage, restoredImage, onReset, onTune, isLoading }) => {
  const [tunePrompt, setTunePrompt] = useState('');

  const handleTuneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tunePrompt.trim() && !isLoading) {
      onTune(tunePrompt);
      setTunePrompt('');
    }
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Your Memory, Restored!</h2>
          <p className="text-slate-600 mt-2">Compare the original photo with the AI-enhanced version.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-semibold mb-4">Before</h3>
          <div className="w-full aspect-square rounded-xl shadow-2xl overflow-hidden border-4 border-white">
            <img src={originalImage} alt="Original" className="w-full h-full object-contain bg-slate-200" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-semibold mb-4">After</h3>
          <div className="w-full aspect-square rounded-xl shadow-2xl overflow-hidden border-4 border-white">
            <img src={restoredImage} alt="Restored" className="w-full h-full object-contain bg-slate-200" />
          </div>
        </div>
      </div>
      
      <div className="mt-12 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">
          Refine Your Memory
        </h3>
        <p className="text-sm text-slate-600 mb-3">
          Not quite perfect? Provide more instructions to tune the restored image.
        </p>
        <form onSubmit={handleTuneSubmit}>
          <textarea
            value={tunePrompt}
            onChange={(e) => setTunePrompt(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-slate-50 text-slate-900"
            rows={2}
            placeholder="e.g., Make the sky a deeper blue. Remove the scratch on the left side."
            disabled={isLoading}
          />
          <div className="mt-4 text-right">
            <button
              type="submit"
              disabled={!tunePrompt.trim() || isLoading}
              className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-full hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105 duration-300 shadow-md"
            >
              Refine Image
            </button>
          </div>
        </form>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
        <a
          href={restoredImage}
          download={`restored-memory-${Date.now()}.png`}
          className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-transform transform hover:scale-105 duration-300 shadow-lg inline-flex items-center gap-2"
        >
          <DownloadIcon className="w-5 h-5" />
          Download Restored Image
        </a>
        <button
          onClick={onReset}
          className="bg-slate-600 text-white font-bold py-3 px-8 rounded-full hover:bg-slate-700 transition-transform transform hover:scale-105 duration-300 shadow-lg"
        >
          Restore Another Photo
        </button>
      </div>
    </div>
  );
};