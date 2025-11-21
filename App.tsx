import React, { useState } from 'react';
import { HeroInput } from './components/HeroInput';
import { ProgressBar } from './components/ProgressBar';
import { BookPreview } from './components/BookPreview';
import { generateStoryStructure, generateIllustration } from './services/gemini';
import { generatePDF } from './utils/pdfGenerator';
import { AppState, Story, Scene } from './types';
import { Heart, Cloud } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [story, setStory] = useState<Story | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (childName: string, theme: string) => {
    try {
      setError(null);
      setAppState(AppState.GENERATING_STORY);
      setStatusMessage('Writing a beautiful story...');
      setProgress(10);

      // 1. Generate Story Text
      const generatedStory = await generateStoryStructure(childName, theme);
      setStory(generatedStory);
      
      setAppState(AppState.GENERATING_IMAGES);
      setStatusMessage('Drawing coloring pages...');
      setProgress(30);

      // 2. Generate Images sequentially (or parallel, but sequential is safer for rate limits)
      const scenesWithImages: Scene[] = [];
      const totalScenes = generatedStory.scenes.length;

      for (let i = 0; i < totalScenes; i++) {
        const scene = generatedStory.scenes[i];
        setStatusMessage(`Drawing page ${i + 1} of ${totalScenes}...`);
        
        const imageData = await generateIllustration(scene.imagePrompt);
        scenesWithImages.push({ ...scene, imageData });
        
        // Update progress based on completed images
        // Mapping 30% -> 90% range for images
        const imageProgressStep = 60 / totalScenes;
        setProgress(30 + ((i + 1) * imageProgressStep));
      }

      // Update story with images
      const finalStory = { ...generatedStory, scenes: scenesWithImages };
      setStory(finalStory);

      setAppState(AppState.COMPLETE);
      setStatusMessage('Ready!');
      setProgress(100);

    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      setError('Oh no! Something went wrong while creating the book. Please try again.');
    }
  };

  const handleDownload = async () => {
    if (!story) return;
    setAppState(AppState.COMPILING_PDF);
    setStatusMessage('Stitching your PDF together...');
    
    try {
      await generatePDF(story);
      setAppState(AppState.COMPLETE); // Return to view mode
    } catch (e) {
      console.error(e);
      setError("Failed to generate PDF. Please try again.");
      setAppState(AppState.COMPLETE);
    }
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setStory(null);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 text-sky-200 animate-pulse opacity-50"><Cloud size={64} /></div>
      <div className="absolute top-40 right-20 text-pink-100 opacity-60"><Heart size={48} /></div>
      <div className="absolute bottom-20 left-1/4 text-yellow-100 opacity-60"><Cloud size={80} /></div>

      {/* Header */}
      <header className="w-full p-6 flex items-center justify-center relative z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={resetApp}>
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            G
          </div>
          <h1 className="text-3xl font-bold text-slate-700 handwritten">GraceFill Color</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 relative z-10 flex flex-col items-center">
        
        {appState === AppState.IDLE && (
          <div className="mt-10 w-full animate-fade-in-up">
            <HeroInput onSubmit={handleGenerate} isLoading={false} />
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-center px-4">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✨</div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Personalized Stories</h3>
                    <p className="text-slate-500">Your child becomes the hero in a unique story generated just for them.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🎨</div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Printable Art</h3>
                    <p className="text-slate-500">Clean, thick-lined illustrations perfect for crayons and markers.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✝️</div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Christian Values</h3>
                    <p className="text-slate-500">Gentle moral lessons grounded in faith, hope, and love.</p>
                </div>
            </div>
          </div>
        )}

        {(appState === AppState.GENERATING_STORY || appState === AppState.GENERATING_IMAGES || appState === AppState.COMPILING_PDF) && (
          <div className="flex flex-col items-center justify-center flex-1 w-full">
             <ProgressBar status={statusMessage} progress={progress} />
             <div className="mt-8 grid grid-cols-5 gap-4 w-full max-w-2xl opacity-50 pointer-events-none grayscale">
                 {[1,2,3,4,5].map(n => (
                     <div key={n} className={`aspect-[1/1.41] border-2 border-slate-200 rounded-lg bg-white transition-all duration-500 ${progress > 30 + (n*10) ? '!grayscale-0 !opacity-100 border-sky-400 shadow-md transform -translate-y-2' : ''}`}></div>
                 ))}
             </div>
          </div>
        )}

        {appState === AppState.COMPLETE && story && (
          <BookPreview story={story} onDownload={handleDownload} />
        )}

        {appState === AppState.ERROR && (
          <div className="text-center mt-20 p-8 bg-red-50 rounded-2xl border border-red-200 max-w-lg">
            <div className="text-5xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Oops!</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
                onClick={resetApp}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
            >
                Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-slate-400 text-sm relative z-10">
        <p>&copy; {new Date().getFullYear()} GraceFill Color. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;