import React, { useState } from 'react';
import { getPresetGossips, chefReactions } from '../utils/gossipData';
import { Language } from '../hooks/useLanguage';
import { translations } from '../utils/translations';
import { CheckCircle } from 'lucide-react';
import aQR from '../assets/Screen.png';
import { submitVote } from '../utils/api';

interface GossipInputProps {
  onAddGossip: (text: string, emoji: string, mealType: 'lunch' | 'deli' | 'grill') => void;
  language: Language;
  onInteraction: () => void;
}

export const GossipInput: React.FC<GossipInputProps> = ({ onAddGossip, language, onInteraction }) => {
  const [customText, setCustomText] = useState('');
  const [showDelight, setShowDelight] = useState(false);
  const [currentReaction, setCurrentReaction] = useState('');
  const [activeMealType, setActiveMealType] = useState<'lunch' | 'deli' | 'grill'>('lunch');
  const [lastNonLunchInteraction, setLastNonLunchInteraction] = useState<number | null>(null);
  const [showFlyingMessage, setShowFlyingMessage] = useState(false);
  const [flyingText, setFlyingText] = useState('');
  const [flyingEmoji, setFlyingEmoji] = useState('');
  const [flyingPosition, setFlyingPosition] = useState({ x: 50, y: 50 });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const t = translations[language];
  const presets = getPresetGossips(language)[activeMealType];

  const handlePresetClick = async (text: string, emoji: string) => {
    onInteraction();
    if (activeMealType !== 'lunch') {
      setLastNonLunchInteraction(Date.now());
    }
    
    // Submit to API
    await submitVote(activeMealType, text, null);
    
    // Calculate where the bubble will land on the wall
    const landingX = Math.random() * 70 + 15;
    const landingY = Math.random() * 70 + 15;
    
    triggerFlyingMessage(text, emoji, landingX, landingY);
    onAddGossip(text, emoji, activeMealType);
    triggerDelight(emoji); // Pass the emoji to the delight function
    showSuccess();
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onInteraction();
    if (activeMealType !== 'lunch') {
      setLastNonLunchInteraction(Date.now());
    }
    if (customText.trim()) {
      // Submit to API
      await submitVote(activeMealType, customText.trim(), customText.trim());
      
      const landingX = Math.random() * 70 + 15;
      const landingY = Math.random() * 70 + 15;
      
      triggerFlyingMessage(customText.trim(), '💭', landingX, landingY);
      onAddGossip(customText.trim(), '💭', activeMealType);
      setCustomText('');
      triggerDelight('💭'); // Pass the custom emoji
      showSuccess();
    }
  };

  const handleMealTypeChange = (type: 'lunch' | 'deli' | 'grill') => {
    onInteraction();
    setActiveMealType(type);
    if (type !== 'lunch') {
      setLastNonLunchInteraction(Date.now());
    }
  };

  // Auto-reset non-lunch to lunch after 1 minute of inactivity
  React.useEffect(() => {
    if (activeMealType !== 'lunch' && lastNonLunchInteraction) {
      const interval = setInterval(() => {
        const now = Date.now();
        const timeSinceLastInteraction = now - lastNonLunchInteraction;
        
        // If more than 1 minute (60000ms) has passed
        if (timeSinceLastInteraction > 60000) {
          setActiveMealType('lunch');
          setLastNonLunchInteraction(null);
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [activeMealType, lastNonLunchInteraction]);

  const showSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const triggerFlyingMessage = (text: string, emoji: string, targetX: number, targetY: number) => {
    setFlyingText(text);
    setFlyingEmoji(emoji);
    setFlyingPosition({ x: targetX, y: targetY });
    setShowFlyingMessage(true);
    setTimeout(() => setShowFlyingMessage(false), 1500);
  };

  const triggerDelight = (emoji: string) => {
    setCurrentReaction(emoji); // Use the actual emoji from the button
    setShowDelight(true);
    setTimeout(() => setShowDelight(false), 2000);
  };

  return (
    <div className="relative">
      {/* Flying Message Animation */}
      {showFlyingMessage && (
        <div 
          className="fixed z-50 pointer-events-none transition-all duration-1500 ease-out"
          style={{
            left: '50%',
            bottom: '150px',
            transform: 'translateX(-50%)',
            animation: `flyToWall 1.5s ease-out forwards`
          }}
        >
          <div className={`
            px-4 py-2 rounded-full text-white font-bold text-sm flex items-center space-x-2 shadow-xl
            ${activeMealType === 'lunch' 
              ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
              : activeMealType === 'deli'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
              : 'bg-gradient-to-r from-red-500 to-pink-500'
            }
          `}>
            <span>{flyingEmoji}</span>
            <span>{flyingText}</span>
          </div>
        </div>
      )}

      {/* Delight Animation */}
      {showDelight && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="text-3xl animate-bounce">
            {currentReaction}
          </div>
        </div>
      )}

      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl lg:text-2xl font-black text-white mb-1 lg:mb-2 drop-shadow-lg">
          {t.inputTitle}
        </h2>
        <p className="text-sm sm:text-base lg:text-base text-gray-200 font-medium px-2">{t.inputSubtitle}</p>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-start justify-center gap-4 max-w-6xl mx-auto">
        {/* Meal Type Selection - Desktop */}
        <div className="flex flex-col space-y-2 flex-shrink-0">
          <p className="text-base font-bold text-gray-200 text-center mb-1">{t.chooseMeal}</p>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleMealTypeChange('lunch')}
              className={`
                py-3 px-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 min-w-[110px] border-3 shadow-xl cursor-pointer
                shadow-lg hover:shadow-2xl active:shadow-inner
                ${activeMealType === 'lunch' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xl scale-105 border-orange-400 ring-4 ring-orange-200' 
                  : 'bg-gradient-to-br from-orange-50 to-amber-50 text-orange-700 hover:text-orange-800 hover:from-orange-100 hover:to-amber-100 border-orange-300 hover:border-orange-400 hover:scale-105'
                }
              `}
            >
              <span className="text-2xl">🍲</span>
              <span>{t.lunch}</span>
              {activeMealType === 'lunch' && <span className="text-base">✓</span>}
            </button>
            <button
              onClick={() => handleMealTypeChange('deli')}
              className={`
                py-3 px-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 min-w-[110px] border-3 shadow-xl cursor-pointer
                shadow-lg hover:shadow-2xl active:shadow-inner
                ${activeMealType === 'deli' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-2xl scale-105 border-teal-400 ring-4 ring-teal-200' 
                  : 'bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-700 hover:text-teal-800 hover:from-teal-100 hover:to-cyan-100 border-teal-300 hover:border-teal-400 hover:scale-105'
                }
              `}
            >
              <span className="text-2xl">🥪</span>
              <span>{t.deli}</span>
              {activeMealType === 'deli' && <span className="text-base">✓</span>}
            </button>
            <button
              onClick={() => handleMealTypeChange('grill')}
              className={`
                py-3 px-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 min-w-[110px] border-3 shadow-xl cursor-pointer
                shadow-lg hover:shadow-2xl active:shadow-inner
                ${activeMealType === 'grill' 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-2xl scale-105 border-pink-400 ring-4 ring-pink-200' 
                  : 'bg-gradient-to-br from-red-50 to-pink-50 text-red-700 hover:text-red-800 hover:from-red-100 hover:to-pink-100 border-red-300 hover:border-red-400 hover:scale-105'
                }
              `}
            >
              <span className="text-2xl">🔥</span>
              <span>{t.grill}</span>
              {activeMealType === 'grill' && <span className="text-base">✓</span>}
            </button>
          </div>
        </div>

        {/* Quick Takes - Desktop */}
        <div className="flex-1">
          <p className="text-gray-200 font-bold mb-3 text-base text-center">
            {t.quickOpinions}
          </p>
          <div className="grid grid-cols-6 gap-2">
            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePresetClick(preset.text, preset.emoji)}
                className={`
                  aspect-square rounded-2xl relative overflow-hidden
                  transform hover:scale-110 active:scale-95 transition-all duration-200
                  shadow-lg hover:shadow-2xl active:shadow-inner border-3 
                  backdrop-blur-sm cursor-pointer touch-manipulation
                  flex flex-col items-center justify-center p-3
                  group active:shadow-inner min-h-[80px]
                  group active:shadow-inner min-h-[70px]
                  ${activeMealType === 'lunch' 
                    ? 'bg-gradient-to-br from-orange-500/20 to-amber-500/20 border-orange-400/50 hover:from-orange-400/30 hover:to-amber-400/30 hover:border-orange-300' 
                    : activeMealType === 'deli'
                    ? 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border-teal-400/50 hover:from-teal-400/30 hover:to-cyan-400/30 hover:border-teal-300'
                    : 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-400/50 hover:from-red-400/30 hover:to-pink-400/30 hover:border-red-300'
                  }
                `}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-200 bg-gradient-to-br from-white to-transparent" />
                <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
                  <span className="text-2xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-200">{preset.emoji}</span>
                  <span className={`
                    text-center leading-tight font-black text-xs tracking-tight drop-shadow-md
                    ${activeMealType === 'lunch' 
                      ? 'text-orange-200 group-hover:text-orange-100' 
                      : activeMealType === 'deli'
                      ? 'text-teal-200 group-hover:text-teal-100'
                      : 'text-red-200 group-hover:text-red-100'
                    }
                  `}>
                    {preset.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input - Desktop */}
        <div className="flex-shrink-0 w-48">
          <p className="text-gray-200 font-bold mb-3 text-base text-center">
            {t.customOpinion}
          </p>
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-white p-3 rounded-2xl shadow-xl border-3 border-white/50">
              <img 
                src={aQR}
                alt="Restaurant B QR Code" 
                className="w-28 h-28 rounded-lg object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-gray-200 font-bold text-xs">{t.scanToSubmit}</p>
              <p className="text-gray-300 text-xs">{t.yourOwnOpinions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-6">
        {/* Meal Type Selection - Mobile */}
        <div className="space-y-3">
          <p className="text-base font-bold text-gray-200 text-center">{t.chooseMeal}</p>
          <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleMealTypeChange('lunch')}
            className={`
              py-3 px-2 rounded-xl font-bold text-sm transition-all duration-300 flex flex-col items-center justify-center space-y-1 border-3 shadow-xl cursor-pointer
              shadow-lg hover:shadow-2xl active:shadow-inner
              ${activeMealType === 'lunch' 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xl border-orange-400' 
                : 'bg-gradient-to-br from-orange-50 to-amber-50 text-orange-700 border-orange-300'
              }
            `}
          >
            <span className="text-2xl">🍲</span>
            <span>{t.lunch}</span>
            {activeMealType === 'lunch' && <span className="text-sm">✓</span>}
          </button>
          <button
            onClick={() => handleMealTypeChange('deli')}
            className={`
              py-3 px-2 rounded-xl font-bold text-sm transition-all duration-300 flex flex-col items-center justify-center space-y-1 border-3 shadow-xl cursor-pointer
              shadow-lg hover:shadow-2xl active:shadow-inner
              ${activeMealType === 'deli' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-2xl border-teal-400' 
                : 'bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-700 border-teal-300'
              }
            `}
          >
            <span className="text-2xl">🥪</span>
            <span>{t.deli}</span>
            {activeMealType === 'deli' && <span className="text-sm">✓</span>}
          </button>
          <button
            onClick={() => handleMealTypeChange('grill')}
            className={`
              py-3 px-2 rounded-xl font-bold text-sm transition-all duration-300 flex flex-col items-center justify-center space-y-1 border-3 shadow-xl cursor-pointer
              shadow-lg hover:shadow-2xl active:shadow-inner
              ${activeMealType === 'grill' 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-2xl border-pink-400' 
                : 'bg-gradient-to-br from-red-50 to-pink-50 text-red-700 border-red-300'
              }
            `}
          >
            <span className="text-2xl">🔥</span>
            <span>{t.grill}</span>
            {activeMealType === 'grill' && <span className="text-sm">✓</span>}
          </button>
          </div>
        </div>

        {/* Quick Takes - Mobile */}
        <div>
          <p className="text-gray-200 font-bold mb-3 text-base text-center">
            {t.quickOpinions}
          </p>
          
          {/* Success Message - Mobile Only */}
          {showSuccessMessage && (
            <div className="mb-3 flex justify-center animate-bounce lg:hidden">
              <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-xl flex items-center space-x-2 border-2 border-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="font-bold text-sm">{t.opinionVisible}</span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-2">
            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePresetClick(preset.text, preset.emoji)}
                className={`
                  aspect-square rounded-xl relative overflow-hidden
                  transform hover:scale-110 active:scale-95 transition-all duration-200
                  shadow-lg hover:shadow-2xl active:shadow-inner border-3 
                  backdrop-blur-sm cursor-pointer touch-manipulation
                  flex flex-col items-center justify-center p-2
                  group active:shadow-inner min-h-[70px]
                  ${activeMealType === 'lunch' 
                    ? 'bg-gradient-to-br from-orange-500/20 to-amber-500/20 border-orange-400/50 hover:from-orange-400/30 hover:to-amber-400/30 hover:border-orange-300' 
                    : activeMealType === 'deli'
                    ? 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border-teal-400/50 hover:from-teal-400/30 hover:to-cyan-400/30 hover:border-teal-300'
                    : 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-400/50 hover:from-red-400/30 hover:to-pink-400/30 hover:border-red-300'
                  }
                `}
              >
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-200 bg-gradient-to-br from-white to-transparent" />
                <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
                  <span className="text-xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-200">{preset.emoji}</span>
                  <span className={`
                    text-center leading-tight font-black text-xs tracking-tight drop-shadow-md
                    ${activeMealType === 'lunch' 
                      ? 'text-orange-200 group-hover:text-orange-100' 
                      : activeMealType === 'deli'
                      ? 'text-teal-200 group-hover:text-teal-100'
                      : 'text-red-200 group-hover:text-red-100'
                    }
                  `}>
                    {preset.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input - Mobile */}
        <div>
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value.slice(0, 50))}
                placeholder={t.customPlaceholder}
                maxLength={50}
                className={`
                  w-full px-4 py-3 rounded-xl font-medium text-gray-800 placeholder-gray-500
                  border-3 shadow-lg focus:outline-none focus:ring-4 transition-all duration-200
                  ${activeMealType === 'lunch'
                    ? 'border-orange-300 focus:border-orange-400 focus:ring-orange-200 bg-orange-50'
                    : activeMealType === 'deli'
                    ? 'border-teal-300 focus:border-teal-400 focus:ring-teal-200 bg-teal-50'
                    : 'border-red-300 focus:border-red-400 focus:ring-red-200 bg-red-50'
                  }
                `}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {50 - customText.length} {t.charactersLeft}
              </span>
              <button
                type="submit"
                disabled={!customText.trim()}
                className={`
                  px-6 py-2 rounded-lg font-bold text-sm transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${activeMealType === 'lunch'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                    : activeMealType === 'deli'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
                    : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600'
                  }
                `}
              >
                {t.submit}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes flyToWall {
          0% {
            transform: translateX(-50%) translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(-300px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};