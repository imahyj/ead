import React, { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface Props {
  onSubmit: (name: string, theme: string) => void;
  isLoading: boolean;
}

export const HeroInput: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && theme.trim()) {
      onSubmit(name, theme);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-sky-100">
      <div className="bg-sky-400 p-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/clouds.png')]"></div>
        <BookOpen className="w-16 h-16 text-white mx-auto mb-2" />
        <h2 className="text-3xl font-bold text-white handwritten tracking-wide">Create Your Coloring Book</h2>
        <p className="text-sky-50 font-medium">Biblical stories tailored for your little one</p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-600 font-semibold mb-2 ml-1">Child's Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Noah, Sarah, David"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-2 ml-1">Story Theme or Lesson</label>
            <textarea
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g. Learning to share toys, Being brave like Daniel, Forgiving a friend"
              disabled={isLoading}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all text-lg resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl text-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2
              ${isLoading 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-sky-400 to-blue-500 hover:shadow-lg hover:shadow-sky-200'
              }`}
          >
            {isLoading ? (
              'Creating Magic...'
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Generate Coloring Book
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};