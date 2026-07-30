import React from 'react';
import { MealType } from '../types';

interface MealTypeSelectorProps {
  selectedMealType: MealType;
  onSelectMealType: (type: 'lunch' | 'deli') => void;
}

export const MealTypeSelector: React.FC<MealTypeSelectorProps> = ({
  selectedMealType,
  onSelectMealType
}) => {
  return (
    <div className="flex flex-col items-center space-y-6 mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center leading-tight">
        🍵 Spill the Tea
      </h1>
      <p className="text-lg text-gray-600 text-center max-w-md">
        What did you think of today's meal?
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={() => onSelectMealType('lunch')}
          className={`
            relative overflow-hidden px-8 py-6 rounded-2xl font-bold text-xl
            transform transition-all duration-300 hover:scale-105 active:scale-95
            ${selectedMealType === 'lunch' 
              ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-xl scale-105' 
              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300 shadow-lg'
            }
          `}
        >
          <div className="flex items-center justify-center space-x-3">
            <span className="text-3xl">🍲</span>
            <span>Lunch</span>
          </div>
          {selectedMealType === 'lunch' && (
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-20 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => onSelectMealType('deli')}
          className={`
            relative overflow-hidden px-8 py-6 rounded-2xl font-bold text-xl
            transform transition-all duration-300 hover:scale-105 active:scale-95
            ${selectedMealType === 'deli' 
              ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-xl scale-105' 
              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300 shadow-lg'
            }
          `}
        >
          <div className="flex items-center justify-center space-x-3">
            <span className="text-3xl">🥪</span>
            <span>Deli</span>
          </div>
          {selectedMealType === 'deli' && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-20 animate-pulse" />
          )}
        </button>
      </div>

      {selectedMealType && (
        <div className="text-center animate-bounce">
          <p className="text-lg font-semibold text-gray-700">
            {selectedMealType === 'lunch' ? '🍲 Lunch crowd reporting in!' : '🥪 Deli crew gossiping!'}
          </p>
        </div>
      )}
    </div>
  );
};