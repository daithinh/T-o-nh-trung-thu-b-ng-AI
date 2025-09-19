
import React, { useCallback, useEffect, useState } from 'react';
import { FEMALE_PROMPTS, MALE_PROMPTS, FEMALE_PROMPTS_V2 } from '../constants';
import { generateCreativePrompt } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { ShuffleIcon } from './icons/ShuffleIcon';

interface PromptSelectorProps {
  selectedPrompt: string;
  onPromptSelect: (prompt: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  gender: 'female' | 'male';
  onGenderChange: (gender: 'female' | 'male') => void;
}

const FemaleIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="4"/><path d="M12 14v8"/><path d="M9 19h6"/></svg>
);

const MaleIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="14" r="4"/><path d="M14 4l6 6"/><path d="M14 10h6V4"/></svg>
);


const PromptSelector: React.FC<PromptSelectorProps> = ({ selectedPrompt, onPromptSelect, setIsLoading, setError, gender, onGenderChange }) => {
  const [promptVersion, setPromptVersion] = useState<1 | 2>(1);

  const currentPrompts = gender === 'female' 
    ? (promptVersion === 1 ? FEMALE_PROMPTS : FEMALE_PROMPTS_V2) 
    : MALE_PROMPTS;
  
  useEffect(() => {
    onPromptSelect('');
  }, [gender, promptVersion, onPromptSelect]);

  const handleRandomSelect = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * currentPrompts.length);
    onPromptSelect(currentPrompts[randomIndex].text);
  }, [onPromptSelect, currentPrompts]);

  const handleCreativeRandom = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const prompt = await generateCreativePrompt(gender);
      onPromptSelect(prompt);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Không thể tạo lời nhắc ngẫu nhiên.');
    } finally {
      setIsLoading(false);
    }
  }, [onPromptSelect, setIsLoading, setError, gender]);

  // Style definitions for reusability
  const genderButtonClass = "flex-1 flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-md transition-all duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-400";
  const selectedGenderClass = "bg-red-600 text-white shadow-md";
  const unselectedGenderClass = "bg-transparent hover:bg-slate-700/50 text-slate-300";
  
  const randomButtonBaseClass = "flex w-full items-center justify-center gap-2 font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 duration-300";
  
  const cardBaseClass = "relative group p-4 rounded-xl cursor-pointer transition-all duration-300 h-32 overflow-hidden flex flex-col justify-between text-left shadow-md border border-slate-700/50";
  const cardUnselectedClass = "bg-slate-800/60 hover:bg-slate-700/80 hover:shadow-lg hover:-translate-y-1";
  const cardSelectedClass = "bg-red-800/60 ring-2 ring-amber-400 scale-105 shadow-xl -translate-y-1 border-red-700";

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner flex flex-col">
      <h2 className="text-2xl font-semibold text-amber-400 mb-4">2. Chọn một phong cách</h2>
      
      {/* Gender Selection */}
      <div className="mb-5">
        <div className="flex bg-slate-900/50 p-1 rounded-lg">
          <button 
            onClick={() => onGenderChange('female')}
            className={`${genderButtonClass} ${gender === 'female' ? selectedGenderClass : unselectedGenderClass}`}
            aria-pressed={gender === 'female'}
          >
            <FemaleIcon className="w-5 h-5"/>
            Nữ
          </button>
          <button 
            onClick={() => onGenderChange('male')}
            className={`${genderButtonClass} ${gender === 'male' ? selectedGenderClass : unselectedGenderClass}`}
            aria-pressed={gender === 'male'}
          >
            <MaleIcon className="w-5 h-5"/>
            Nam
          </button>
        </div>
      </div>
      
      {/* Version Selection */}
      {gender === 'female' && (
        <div className="mb-5">
          <div className="flex bg-slate-900/50 p-1 rounded-lg">
            <button 
              onClick={() => setPromptVersion(1)}
              className={`${genderButtonClass} ${promptVersion === 1 ? selectedGenderClass : unselectedGenderClass}`}
              aria-pressed={promptVersion === 1}
            >
              Bộ Sưu Tập 1 (Đỏ)
            </button>
            <button 
              onClick={() => setPromptVersion(2)}
              className={`${genderButtonClass} ${promptVersion === 2 ? selectedGenderClass : unselectedGenderClass}`}
              aria-pressed={promptVersion === 2}
            >
              Bộ Sưu Tập 2 (Vàng)
            </button>
          </div>
        </div>
      )}

      {/* Prompt Grid */}
      <div className="relative flex-grow min-h-0">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2 -mr-2 pb-12">
          {currentPrompts.map((prompt) => (
            <div
              key={prompt.id}
              onClick={() => onPromptSelect(prompt.text)}
              className={`${cardBaseClass} ${
                selectedPrompt === prompt.text
                  ? cardSelectedClass
                  : cardUnselectedClass
              }`}
              role="button"
              aria-pressed={selectedPrompt === prompt.text}
              tabIndex={0}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80 group-hover:from-black/70 transition-opacity"></div>
              <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-red-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative font-mono text-3xl font-bold text-amber-400/30 group-hover:text-amber-400/60 transition-colors">
                {String(prompt.id).padStart(2, '0')}
              </div>
              <h3 className="relative font-bold text-sm text-white leading-tight drop-shadow-md">
                {prompt.title}
              </h3>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-800/50 to-transparent pointer-events-none"></div>
      </div>

       {selectedPrompt && (
        <div className="mt-4 p-4 bg-slate-900/70 rounded-md border border-slate-700/50">
          <p className="text-xs font-medium text-amber-300 mb-1">Phong cách đã chọn:</p>
          <p className="text-sm text-slate-300">{selectedPrompt}</p>
        </div>
      )}
      
      {/* Randomizer actions */}
      <div className="mt-4 border-t border-slate-700/50 pt-4">
        <p className="text-center text-sm text-slate-400 mb-3">Bạn không chắc chắn chọn gì? Hãy để AI giúp bạn!</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={handleRandomSelect}
            className={`${randomButtonBaseClass} bg-slate-700 hover:bg-slate-600 text-white`}
          >
            <ShuffleIcon className="w-5 h-5"/>
            Chọn ngẫu nhiên
          </button>
          <button 
            onClick={handleCreativeRandom}
            className={`${randomButtonBaseClass} bg-amber-500 hover:bg-amber-600 text-slate-900`}
          >
            <SparklesIcon className="w-5 h-5"/>
            AI Sáng tạo
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptSelector;
