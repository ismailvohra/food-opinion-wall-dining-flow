import React from 'react';
import { GossipInput } from './components/GossipInput';
import { GossipWall } from './components/GossipWall';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useGossipBubbles } from './hooks/useGossipBubbles';
import { useLanguage } from './hooks/useLanguage';
import { translations } from './utils/translations';

function App() {
  const {
    bubbles,
    addGossip,
    clearBubbles
  } = useGossipBubbles();

  const { language, switchLanguage, updateInteraction } = useLanguage();
  const t = translations[language];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative flex flex-col">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-yellow-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Language Switcher */}
        <div className="relative">
          <LanguageSwitcher 
            currentLanguage={language}
            onLanguageChange={switchLanguage}
          />
        </div>

        {/* Header */}
        <div className="text-center py-3 flex-shrink-0 hidden lg:block pt-20 lg:pt-3">
          <div className="inline-flex items-center space-x-2 mb-1">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400">
              {t.title}
            </h1>
          </div>
          <p className="text-lg text-gray-300 font-medium max-w-2xl mx-auto px-4">
            {t.subtitle}
          </p>
        </div>

        {/* The Wall */}
        <div className="flex-grow hidden lg:block" style={{ height: '115%' }}>
          <div className="h-full overflow-hidden">
            <GossipWall bubbles={bubbles} language={language} />
          </div>
        </div>

        {/* Input Section - Remaining space */}
        <div className="flex-shrink-0 lg:flex-shrink-0 flex-grow lg:flex-grow-0 flex flex-col overflow-y-auto" style={{ maxHeight: '85%' }}>
          <div className="relative bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 backdrop-blur-xl border border-slate-500/50 shadow-2xl lg:rounded-t-3xl rounded-t-3xl p-4 lg:p-6 overflow-visible min-h-fit lg:h-auto">
            {/* Geometric Pattern Background */}
            <div className="absolute inset-0 opacity-20">
              {/* Hexagon Pattern */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  radial-gradient(circle at 30px 30px, rgba(99, 102, 241, 0.4) 2px, transparent 2px),
                  radial-gradient(circle at 60px 60px, rgba(168, 85, 247, 0.3) 1.5px, transparent 1.5px),
                  radial-gradient(circle at 90px 30px, rgba(236, 72, 153, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px, 120px 120px, 90px 90px'
              }}></div>
              
              {/* Grid Lines */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                  linear-gradient(0deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}></div>
              
              {/* Diamond Pattern */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(45deg, rgba(236, 72, 153, 0.15) 25%, transparent 25%),
                  linear-gradient(-45deg, rgba(99, 102, 241, 0.15) 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, rgba(168, 85, 247, 0.15) 75%),
                  linear-gradient(-45deg, transparent 75%, rgba(236, 72, 153, 0.15) 75%)
                `,
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px'
              }}></div>
            </div>
            
            {/* Glowing accent lines */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-40"></div>
            
            {/* Content with relative positioning to appear above pattern */}
            <div className="relative z-10 text-white">
            <GossipInput onAddGossip={addGossip} language={language} onInteraction={updateInteraction} />
            </div>
          </div>

          {/* Quick Stats - Direct continuation of input section */}
          {bubbles.length > 0 && (
            <div className="p-3 lg:p-4 bg-gray-900/60 backdrop-blur-sm border-t border-gray-600/30">
              {/* Desktop Footer */}
              <div className="hidden lg:flex items-center justify-between text-xl space-x-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-2 bg-orange-500/30 backdrop-blur-sm border border-orange-400/50 px-4 py-2 rounded-full text-orange-200 font-semibold">
                    <span className="text-2xl">🍲</span>
                    <span className="font-semibold">{bubbles.filter(b => b.mealType === 'lunch').reduce((sum, b) => sum + b.votes, 0)}</span>
                  </span>
                  <span className="flex items-center space-x-2 bg-emerald-500/30 backdrop-blur-sm border border-emerald-400/50 px-4 py-2 rounded-full text-emerald-200 font-semibold">
                    <span className="text-2xl">🥪</span>
                    <span className="font-semibold">{bubbles.filter(b => b.mealType === 'deli').reduce((sum, b) => sum + b.votes, 0)}</span>
                  </span>
                </div>
                <div className="flex-1 text-center px-4">
                  <p className="text-gray-300 text-sm font-medium">
                    {t.projectValidation}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-200 font-medium">🔥 {bubbles.reduce((sum, b) => sum + b.votes, 0)} {t.hotTakes}</span>
                </div>
              </div>
              
              {/* Mobile Footer */}
              <div className="lg:hidden space-y-3">
                <div className="flex items-center justify-center space-x-3">
                  <span className="flex items-center space-x-2 bg-orange-500/30 backdrop-blur-sm border border-orange-400/50 px-4 py-2 rounded-full text-orange-200 font-semibold">
                    <span className="text-xl">🍲</span>
                    <span className="font-semibold">{bubbles.filter(b => b.mealType === 'lunch').reduce((sum, b) => sum + b.votes, 0)}</span>
                  </span>
                  <span className="flex items-center space-x-2 bg-emerald-500/30 backdrop-blur-sm border border-emerald-400/50 px-4 py-2 rounded-full text-emerald-200 font-semibold">
                    <span className="text-xl">🥪</span>
                    <span className="font-semibold">{bubbles.filter(b => b.mealType === 'deli').reduce((sum, b) => sum + b.votes, 0)}</span>
                  </span>
                  <span className="flex items-center space-x-2 bg-red-500/30 backdrop-blur-sm border border-red-400/50 px-4 py-2 rounded-full text-red-200 font-semibold">
                    <span className="text-xl">🔥</span>
                    <span className="font-semibold">{bubbles.reduce((sum, b) => sum + b.votes, 0)}</span>
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-xs font-medium px-2 leading-tight">
                    {t.projectValidation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;