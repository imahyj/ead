import React from 'react';
import { Story } from '../types';
import { Download, Printer } from 'lucide-react';

interface Props {
  story: Story;
  onDownload: () => void;
}

export const BookPreview: React.FC<Props> = ({ story, onDownload }) => {
  return (
    <div className="w-full animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-slate-800 handwritten mb-2">Your Story is Ready!</h2>
        <p className="text-slate-600 text-lg">Previewing "{story.title}" for {story.childName}</p>
        
        <button
          onClick={onDownload}
          className="mt-6 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mx-auto"
        >
          <Download className="w-6 h-6" />
          Download PDF to Print
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {/* Cover Preview */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200 aspect-[1/1.41] flex flex-col items-center justify-center text-center relative group">
            <div className="absolute top-2 left-2 bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded">Cover</div>
            <div className="p-4 border-2 border-dashed border-slate-300 w-full h-full flex flex-col justify-center items-center">
                <h3 className="font-bold text-2xl mb-2 font-serif">My Christian<br/>Coloring Storybook</h3>
                <p className="text-sm mb-4">Made for {story.childName}</p>
                <div className="w-20 h-20 border-2 border-slate-400 flex items-center justify-center rounded-full mb-6">
                    <span className="text-4xl text-slate-300">✝</span>
                </div>
                <p className="handwritten text-xl">"{story.title}"</p>
            </div>
        </div>

        {/* Pages Preview */}
        {story.scenes.map((scene, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow-md border border-slate-200 aspect-[1/1.41] flex flex-col relative group hover:shadow-xl transition-shadow">
            <div className="absolute top-2 left-2 bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded z-10">Page {idx + 1}</div>
            
            <div className="flex-1 border border-slate-100 overflow-hidden bg-white flex items-center justify-center">
               {scene.imageData ? (
                   <img src={scene.imageData} alt={scene.description} className="w-full h-full object-contain opacity-90" />
               ) : (
                   <div className="text-slate-300">Loading Image...</div>
               )}
            </div>
            
            <div className="mt-4 h-24 flex items-center justify-center p-2 bg-slate-50 rounded text-center">
                <p className="text-slate-700 text-sm font-medium leading-snug line-clamp-4">{scene.storyText}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-12 pb-12">
         <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-xl max-w-2xl mx-auto">
             <h3 className="font-bold text-yellow-800 mb-2 uppercase tracking-wider text-sm">The Moral of the Story</h3>
             <p className="text-yellow-900 text-lg italic">"{story.moral}"</p>
         </div>
      </div>
    </div>
  );
};