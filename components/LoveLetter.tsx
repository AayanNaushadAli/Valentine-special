
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Heart, Loader2 } from 'lucide-react';
import { generateLoveLetter } from '../services/gemini';
import confetti from 'canvas-confetti';

interface LoveLetterProps {
  userName: string;
}

const LoveLetter: React.FC<LoveLetterProps> = ({ userName }) => {
  const [letter, setLetter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tone, setTone] = useState<string>('romantic');

  const fetchLetter = async (t: string) => {
    setIsLoading(true);
    const result = await generateLoveLetter(userName, t);
    setLetter(result);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLetter(tone);
  }, [userName]);

  const handleSurprise = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#ffb3c1', '#ffffff']
    });
    fetchLetter(tone);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto px-6 w-full"
    >
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border-t-[12px] border-[#ff4d6d] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Heart className="w-32 h-32 rotate-12" fill="currentColor" />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-romantic font-bold text-[#ff4d6d]">A message for you</h3>
          <div className="flex gap-2">
            {['romantic', 'poetic', 'funny'].map((t) => (
              <button 
                key={t}
                onClick={() => { setTone(t); fetchLetter(t); }}
                className={`text-[10px] px-3 py-1 rounded-full border transition-all ${
                  tone === t ? 'bg-[#ff4d6d] text-white border-[#ff4d6d]' : 'border-pink-200 text-pink-400'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[200px] flex items-center justify-center relative">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-[#ff4d6d] animate-spin" />
              <p className="text-pink-300 animate-pulse text-sm">Brewing some magic...</p>
            </div>
          ) : (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-700 text-lg leading-relaxed font-medium whitespace-pre-wrap"
            >
              {letter}
            </motion.p>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-pink-50 flex justify-between items-center">
          <button 
            onClick={handleSurprise}
            disabled={isLoading}
            className="flex items-center gap-2 bg-pink-50 text-[#ff4d6d] px-6 py-3 rounded-full hover:bg-pink-100 transition-colors font-bold text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Another One
          </button>
          
          <div className="flex items-center gap-2 text-pink-300">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs italic">With all my love</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <p className="text-pink-300 text-xs text-center px-8">
          Generated specially for you. Tap "Another One" for more magic.
        </p>
      </div>
    </motion.div>
  );
};

export default LoveLetter;
