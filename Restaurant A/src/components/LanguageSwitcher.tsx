import React from 'react';
import { Language } from '../hooks/useLanguage';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onLanguageChange
}) => {
  return (
    <div className="absolute top-2 right-2 lg:top-4 lg:right-4 z-30 flex items-center space-x-2">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-full p-1 shadow-lg border border-gray-600/50">
        <button
          onClick={() => onLanguageChange('fi')}
          className={`
            px-1.5 py-0.5 lg:px-3 lg:py-2 rounded-full text-xs lg:text-sm font-bold transition-all duration-200
            ${currentLanguage === 'fi'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-gray-300 hover:text-blue-400 hover:bg-gray-700/50'
            }
          `}
        >
          FI
        </button>
        <button
          onClick={() => onLanguageChange('en')}
          className={`
            px-1.5 py-0.5 lg:px-3 lg:py-2 rounded-full text-xs lg:text-sm font-bold transition-all duration-200
            ${currentLanguage === 'en'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-gray-300 hover:text-blue-400 hover:bg-gray-700/50'
            }
          `}
        >
          EN
        </button>
      </div>
    </div>
  );
};