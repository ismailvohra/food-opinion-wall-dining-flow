import React from 'react';
import { GossipBubble as GossipBubbleType } from '../types';
import { getDisplayText } from '../utils/translationMapping';
import { Language } from '../hooks/useLanguage';

interface GossipBubbleProps {
  bubble: GossipBubbleType;
  language: Language;
}

export const GossipBubble: React.FC<GossipBubbleProps> = ({ bubble, language }) => {
  const bubbleColor = bubble.mealType === 'lunch' 
    ? 'from-amber-500 via-orange-500 to-red-500' 
    : 'from-emerald-500 via-teal-500 to-cyan-500';

  const shadowColor = bubble.mealType === 'lunch' 
    ? 'shadow-orange-400/40' 
    : 'shadow-teal-400/40';

  const glowColor = bubble.mealType === 'lunch'
    ? 'shadow-amber-500/40'
    : 'shadow-emerald-500/40';

  return (
    <div
      className={`
        absolute animate-float cursor-pointer select-none
        bg-gradient-to-r ${bubbleColor}
        text-white px-4 py-3 rounded-full
        shadow-xl ${shadowColor} font-bold text-sm
        flex items-center space-x-2
        transform hover:scale-125 transition-all duration-300
        border-2 border-white/40 backdrop-blur-sm
        hover:${glowColor} hover:shadow-2xl
      `}
      style={{
        left: `${bubble.x}%`,
        top: `${bubble.y}%`,
        transform: `scale(${bubble.size}) rotate(${(bubble.timestamp % 6) - 3}deg)`,
        animationDelay: `${bubble.timestamp % 3000}ms`,
        animationDuration: `${4 + (bubble.timestamp % 4)}s`,
        zIndex: Math.floor(bubble.votes * 5) + Math.floor(bubble.size * 10) + 10
      }}
    >
      <span className="text-lg drop-shadow-sm">{bubble.emoji}</span>
      <span className={`drop-shadow-sm font-black ${bubble.size > 1.8 ? 'text-base' : 'text-sm'}`}>
        {getDisplayText(bubble.text, language)}
      </span>
      {bubble.votes > 1 && (
        <span className={`bg-white/40 backdrop-blur-sm px-2 py-1 rounded-full font-black border border-white/40 animate-pulse ${bubble.size > 1.5 ? 'text-sm' : 'text-xs'}`}>
          +{bubble.votes - 1}
        </span>
      )}
    </div>
  );
};