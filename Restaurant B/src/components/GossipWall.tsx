import React from 'react';
import { GossipBubble } from './GossipBubble';
import { GossipBubble as GossipBubbleType } from '../types';
import { Language } from '../hooks/useLanguage';
import { translations } from '../utils/translations';

interface GossipWallProps {
  bubbles: GossipBubbleType[];
  language: Language;
}

export const GossipWall: React.FC<GossipWallProps> = ({ bubbles, language }) => {
  const t = translations[language];

  return (
    <div className="w-full h-full relative">
      {/* The Wall */}
      <div className="
        w-full h-full bg-gradient-to-br from-gray-800/60 to-gray-900/40 
        backdrop-blur-xl rounded-3xl border border-gray-600/30 
        overflow-hidden shadow-2xl relative
      ">
        {/* Dynamic background effects */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-transparent to-blue-500 animate-pulse"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,165,0,0.2) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 20%, rgba(34,197,94,0.2) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(239,68,68,0.15) 0%, transparent 50%)`
          }}></div>
        </div>

        {/* Floating Gossip Bubbles */}
        <div className="relative w-full h-full p-4">
          <div className="relative w-full h-full">
            {bubbles.map((bubble) => (
              <GossipBubble key={bubble.id} bubble={bubble} language={language} />
            ))}
          </div>

          {/* Animated background pattern - always visible */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 text-6xl animate-float">🍕</div>
            <div className="absolute top-20 right-20 text-5xl animate-float" style={{animationDelay: '1s'}}>🍔</div>
            <div className="absolute bottom-20 left-20 text-4xl animate-float" style={{animationDelay: '2s'}}>🌮</div>
            <div className="absolute bottom-10 right-10 text-6xl animate-float" style={{animationDelay: '3s'}}>🍜</div>
            <div className="absolute top-1/2 left-1/4 text-3xl animate-spin-slow">🍽️</div>
            <div className="absolute top-1/3 right-1/3 text-4xl animate-pulse">👨‍🍳</div>
          </div>

          {/* Persistent "Waiting for more gossip" indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-gray-800/80 backdrop-blur-sm text-gray-300 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 shadow-lg border border-gray-600/50">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span>{t.waitingForMore}</span>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 right-4 text-2xl opacity-30 animate-pulse">🔥</div>
        <div className="absolute bottom-4 left-4 text-2xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}>👀</div>
        <div className="absolute top-4 left-4 text-xl opacity-20 animate-bounce">💬</div>
        <div className="absolute bottom-4 right-4 text-xl opacity-20 animate-bounce" style={{animationDelay: '2s'}}>🗣️</div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg border border-indigo-400/30 backdrop-blur-sm">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>{t.liveFeed}</span>
        </div>
      </div>
    </div>
  );
};