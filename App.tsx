import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { fileToBase64, dataUrlToBase64File } from './utils/fileUtils';
import { restoreMemory } from './services/geminiService';
import { InfoBubble } from './components/InfoBubble';

const App: React.FC = () => {
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [secondaryImage, setSecondaryImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('Fully restore and colorize this old photograph with high fidelity. Remove scratches, dust, stains, and noise while preserving original details. Sharpen facial features, clothing, and background textures without over-smoothing. Apply natural, historically accurate colorization — ensuring all elements (skin tones, hair, eyes, clothing, and environment) are realistically and consistently colored. Avoid leaving any parts in black and white or desaturated. Enhance overall clarity and contrast for a vivid, lifelike result that feels like a modern, high-quality color photograph, while staying true to the original memory.');
  
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [isAbishMode, setIsAbishMode] = useState<boolean>(false);


  const handleRestore = useCallback(async () => {
    if (!primaryImage) {
      setError('Please upload a primary photo to restore.');
      return;
    }
    
    // Easter Egg Logic
    if (primaryImage.name.toLowerCase().includes('abish')) {
        setIsLoading(true);
        setTimeout(() => {
            if (originalImagePreview) {
                URL.revokeObjectURL(originalImagePreview);
            }
            setOriginalImagePreview(URL.createObjectURL(primaryImage));
            setIsAbishMode(true);
            setIsLoading(false);
        }, 1500); // Fake loading for comedic effect
        return;
    }

    setIsLoading(true);
    setError(null);
    setRestoredImage(null);

    try {
      const primaryImageData = await fileToBase64(primaryImage);
      const secondaryImageData = secondaryImage ? await fileToBase64(secondaryImage) : null;
      
      const result = await restoreMemory(primaryImageData, secondaryImageData, prompt);
      setRestoredImage(result);

      if (originalImagePreview) {
        URL.revokeObjectURL(originalImagePreview);
      }
      setOriginalImagePreview(URL.createObjectURL(primaryImage));

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [primaryImage, secondaryImage, prompt, originalImagePreview]);
  
  const handleTune = useCallback(async (tunePrompt: string) => {
    if (!restoredImage) {
      setError('No restored image to tune.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const restoredImageData = dataUrlToBase64File(restoredImage);
      const result = await restoreMemory(restoredImageData, null, tunePrompt);
      setRestoredImage(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during tuning.');
    } finally {
      setIsLoading(false);
    }
  }, [restoredImage]);

  const resetState = () => {
    setPrimaryImage(null);
    setSecondaryImage(null);
    setRestoredImage(null);
    if(originalImagePreview) {
        URL.revokeObjectURL(originalImagePreview);
    }
    setOriginalImagePreview(null);
    setError(null);
    setIsLoading(false);
    setShowAdvanced(false);
    setIsAbishMode(false);
  }

  const handlePrimaryImageSelect = (file: File) => {
    setPrimaryImage(file);
    // Reset Abish mode if a new, non-Abish file is selected
    if (!file.name.toLowerCase().includes('abish')) {
        setIsAbishMode(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Memory Restorer
            </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Breathe new life into your old photos. Restore, colorize, and even add missing family members with the power of AI.
            <span className="inline-block align-middle ml-2"><InfoBubble /></span>
          </p>
        </header>
        
        {isLoading && !isAbishMode && <Loader />}
        
        {isAbishMode && originalImagePreview ? (
            <div className="text-center animate-fade-in max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-2xl border-4 border-red-200">
                    <img src={originalImagePreview} alt="A masterpiece beyond AI's touch" className="max-w-full md:max-w-lg mx-auto rounded-lg shadow-lg border-2 border-slate-200 mb-8" />
                    <h2 className="text-4xl md:text-5xl font-black text-red-700 tracking-wider uppercase flex items-center justify-center gap-4" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                        <span>😂</span>
                        <span>I'm SORRY</span>
                        <span>😂</span>
                    </h2>
                    <p className="text-xl md:text-2xl font-bold text-slate-800 mt-2">
                        NO AMOUNT OF AI CAN HELP FIX THIS!
                    </p>
                </div>
                <button
                onClick={resetState}
                className="mt-10 bg-slate-600 text-white font-bold py-3 px-8 rounded-full hover:bg-slate-700 transition-transform transform hover:scale-105 duration-300 shadow-lg"
                >
                Try Another Photo
                </button>
            </div>
        ) : (
          <>
            {(isLoading && !restoredImage) && <Loader />}
            
            {restoredImage && originalImagePreview ? (
              <ResultDisplay 
                originalImage={originalImagePreview} 
                restoredImage={restoredImage}
                onReset={resetState}
                onTune={handleTune}
                isLoading={isLoading}
              />
            ) : (
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <ImageUploader 
                    title="Primary Photo"
                    subtitle="The main image to restore"
                    onImageSelect={handlePrimaryImageSelect}
                    key="primary-uploader"
                  />
                  <ImageUploader 
                    title="Relative's Photo"
                    subtitle="(Optional) Add a person from this image"
                    onImageSelect={setSecondaryImage}
                    key="secondary-uploader"
                  />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                  <div 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex justify-between items-center cursor-pointer"
                    role="button"
                    aria-expanded={showAdvanced}
                    aria-controls="advanced-prompt"
                  >
                    <h4 className="text-lg font-semibold text-slate-800">
                      Advanced Instructions
                    </h4>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-slate-500 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {showAdvanced && (
                    <div id="advanced-prompt" className="mt-4">
                        <p className="text-sm text-slate-600 mb-2">
                            Provide specific details for the AI, such as adding a person, changing colors, or fixing a specific part of the image.
                        </p>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-slate-50 text-slate-900"
                            rows={3}
                            placeholder="e.g., Restore and colorize this photo. Add the person from the second photo standing next to the woman in the red dress."
                        />
                    </div>
                  )}
                </div>

                {error && <div className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}

                <div className="mt-8 text-center">
                  <button
                    onClick={handleRestore}
                    disabled={!primaryImage || isLoading}
                    className="bg-blue-600 text-white font-bold py-3 px-12 rounded-full hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105 duration-300 shadow-lg"
                  >
                    {isLoading ? 'Restoring...' : 'Restore Memory'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;